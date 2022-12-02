/* eslint-disable no-new */


function init() {
  const buttons = document.querySelectorAll('.filter-by');

  buttons.forEach((button) => button.addEventListener('click', getAndDispOptions));
}


function createList(options, parentNode, eventFunction) {
  const newOptions = document.createElement('div');
  newOptions.classList.add('options');
  options.forEach((opt) => {
    const buttonBox = document.createElement('div');
    const newButton = document.createElement('button');
    newButton.textContent = opt;
    newButton.dataset.name = opt;
    buttonBox.dataset.name = opt;

    buttonBox.appendChild(newButton);
    newOptions.appendChild(buttonBox);

    newButton.addEventListener('click', eventFunction);
  });

  parentNode.appendChild(newOptions);
}

async function getAndDispOptions(e) {
  let options = await fetch(`https://engineering-task.elancoapps.com/api/${e.target.dataset.name}`);
  options = await options.json();

  const parentNode = e.target.parentNode;

  createList(options, parentNode, (clickedButton) => { getAndDispInstances(clickedButton, e.target); });
}

async function getAndDispInstances(node, parentNode) {
  let data = await fetch(`https://engineering-task.elancoapps.com/api/${parentNode.dataset.name}/${node.target.dataset.name}`);
  data = await data.json(); // fetch api dataset

  const instances = {}; // seperate out the instances
  let oldInstance = null;
  for (let i = 0; i < data.length; i++) {
    const currentData = data[i];
    const currentInstance = currentData.InstanceId;

    if (currentInstance === oldInstance) {
      instances[currentInstance].push(data[i]);
    } else {
      instances[currentInstance] = [];
      instances[currentInstance].push(data[i]);
    }

    oldInstance = currentInstance;
  }


  // Create instance information
  // Get instances information
  const name = node.target.dataset.name;
  const amtOfInstances = Object.keys(instances).length;
  let totalCost = 0;
  let avgCost = 0;

  for (let i = 0; i < data.length; i++) {
    totalCost += Number(data[i].Cost);
    avgCost += Number(data[i].Cost);
  }

  avgCost = avgCost / data.length;

  // display information
  const instanceInfoTemplate = document.querySelector('#instance-template');
  const clonedinstanceInfoTemplate = instanceInfoTemplate.content.cloneNode(true);

  clonedinstanceInfoTemplate.querySelector('#instance-title').textContent += name;
  clonedinstanceInfoTemplate.querySelector('#amt-of-instances').textContent += amtOfInstances;
  clonedinstanceInfoTemplate.querySelector('#total-cost').textContent += totalCost.toFixed(2);
  clonedinstanceInfoTemplate.querySelector('#avg-cost').textContent += avgCost.toFixed(2);

  node.target.parentNode.appendChild(clonedinstanceInfoTemplate);

  createList(Object.keys(instances), node.target.parentNode, (e) => { dispData(e, instances[e.target.dataset.name]); }); // list the instances
}

function dispData(e, instance) {
  // pull data from the instance

  console.log(instance);

  // Instance information
  const serviceName = instance[0].ServiceName;
  const loc = instance[0].Location;
  const unitOfMeasure = instance[0].UnitOfMeasure;

  // resource information
  const resource = instance[0].MeterCategory;
  const resourceGroup = instance[0].ResourceGroup;
  const resourceLocal = instance[0].ResourceLocation;

  // App information
  const appName = instance[0].Tags['app-name'];
  const env = instance[0].Tags.environment;
  const businessUnit = instance[0].Tags['business-unit'];

  // Cost information
  const daysRan = instance.length;
  let avgCost = 0;
  let overallCost = 0;
  let avgConsumption = 0;
  let overallConsumption = 0;

  const costPerDayData = [];
  const consumptionPerDay = [];

  // calculating averages and graph data
  instance.forEach((day) => {
    // averages
    avgCost += Number(day.Cost);
    overallCost += Number(day.Cost);

    avgConsumption += Number(day.ConsumedQuantity);
    overallConsumption += Number(day.ConsumedQuantity);

    // graph data
    costPerDayData.push({
      x: day.Date,
      y: Number(day.Cost),
    });
    consumptionPerDay.push({
      x: day.Date,
      y: Number(day.ConsumedQuantity),
    });
  });

  avgCost = avgCost / instance.length;
  avgConsumption = avgConsumption / instance.length;

  // put data into template
  const dataTemplate = document.querySelector('#data-template');
  const clonedDataTemplate = dataTemplate.content.cloneNode(true);


  // Instance information
  clonedDataTemplate.querySelector('#service-name').textContent += serviceName;
  clonedDataTemplate.querySelector('#loc').textContent += loc;
  clonedDataTemplate.querySelector('#unit-of-measure').textContent += unitOfMeasure;

  // Resource information
  clonedDataTemplate.querySelector('#resource-name').textContent += resource;
  clonedDataTemplate.querySelector('#resource-group').textContent += resourceGroup;
  clonedDataTemplate.querySelector('#res-loc').textContent += resourceLocal;

  // App information
  clonedDataTemplate.querySelector('#app-name').textContent += appName;
  clonedDataTemplate.querySelector('#env').textContent += env;
  clonedDataTemplate.querySelector('#business-unit').textContent += businessUnit;

  // Cost information
  clonedDataTemplate.querySelector('#days-ran').textContent += daysRan;
  clonedDataTemplate.querySelector('#overall-cost').textContent += overallCost.toFixed(2);
  clonedDataTemplate.querySelector('#average-cost').textContent += avgCost.toFixed(2);
  clonedDataTemplate.querySelector('#overall-consumed').textContent += overallConsumption;
  clonedDataTemplate.querySelector('#average-consumption').textContent += avgConsumption;

  // append to page
  e.target.parentNode.appendChild(clonedDataTemplate);

  // graph generation
  const costGraph = document.createElement('canvas');
  const consumptionGraph = document.createElement('canvas');


  // eslint-disable-next-line no-undef
  new Chart(costGraph, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'cost per day',
        data: costPerDayData,
      }],
    },
  });

  // eslint-disable-next-line no-undef
  new Chart(consumptionGraph, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'consumption per day',
        data: consumptionPerDay,
      }],
    },
  });

  e.target.parentNode.appendChild(costGraph); // needs to be out of template because chart.js cannot get computedStyle
  e.target.parentNode.appendChild(consumptionGraph);
}

init();
