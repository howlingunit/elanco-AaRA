


function init() {
    buttons = document.querySelectorAll('.filter-by');

    buttons.forEach((button) => button.addEventListener('click', getAndDispOptions))
}


function createList(options, parentNode, eventFunction){
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

async function getAndDispOptions(e){
    let options = await fetch(`https://engineering-task.elancoapps.com/api/${e.target.dataset.name}`);
    options = await options.json();

    parentNode = e.target.parentNode;

    createList(options, parentNode, (clickedButton) => {getAndDispInstances(clickedButton, e.target)});

}

async function getAndDispInstances(node, parentNode) {

    let data = await fetch(`https://engineering-task.elancoapps.com/api/${parentNode.dataset.name}/${node.target.dataset.name}`);
    data = await data.json(); //fetch api dataset

    const instances = {} //seperate out the instances
    let oldInstance = null;
    for (let i = 0; i < data.length; i++) {
        const currentData = data[i];
        const currentInstance = currentData.InstanceId

        if (currentInstance === oldInstance) {
            instances[currentInstance].push(data[i]);
        } else {
            instances[currentInstance] = [];
            instances[currentInstance].push(data[i]);
        }

        oldInstance = currentInstance;
    }




    createList(Object.keys(instances), node.target.parentNode, (e) => {dispData(e, instances[e.target.dataset.name])}); //list the instances

}

function dispData(e, instance) {
    // pull data from the instance
    const appName = instance[0].Tags["app-name"];
    const resource = instance[0].MeterCategory;
    const daysRan = instance.length;
    let avgCost = 0;
    let overallCost = 0;

    // getting costs
    instance.forEach((day) => {avgCost += Number(day.Cost); overallCost += Number(day.Cost)});
    avgCost = avgCost / instance.length;

    
    // put data into template
    const dataTemplate = document.querySelector('#data-template');
    const clonedDataTemplate = dataTemplate.content.cloneNode(true);


    clonedDataTemplate.querySelector('#app-name').textContent += appName;
    clonedDataTemplate.querySelector('#resource-name').textContent += resource;
    clonedDataTemplate.querySelector('#days-ran').textContent += daysRan;
    clonedDataTemplate.querySelector('#overall-cost').textContent += overallCost.toFixed(2);
    clonedDataTemplate.querySelector('#average-cost').textContent += avgCost.toFixed(2);


    e.target.parentNode.appendChild(clonedDataTemplate);
}

init();