


function init() {
    buttons = document.querySelectorAll('.filter-by');

    buttons.forEach((button) => button.addEventListener('click', getAndDispOptions))
}

async function getAndDispOptions(e){
    let options = await fetch(`https://engineering-task.elancoapps.com/api/${e.target.dataset.name}`);
    options = await options.json();

    parentNode = e.target.parentNode
    const newOptions = document.createElement('div');
    newOptions.classList.add('options');
    options.forEach((opt) => {
        const newButton = document.createElement('button');
        newButton.textContent = opt;
        newButton.dataset.name = opt;
        newOptions.appendChild(newButton);

        newButton.addEventListener('click', (elem) => {getAndDispdata(elem, e)});
    });

    newOptions.classList.add('options');
    parentNode.appendChild(newOptions);

}

async function getAndDispdata(node, parentNode) {

    let data = await fetch(`https://engineering-task.elancoapps.com/api/${parentNode.target.dataset.name}/${node.target.dataset.name}`);
    data = await data.json();

    const instances = {}
    let oldInstance = null;
    for (let i = 0; i < data.length; i++) {
        const currentData = data[i];
        const currentInstance = currentData.InstanceId

        if (currentInstance === oldInstance) {
            instances[currentInstance].push(data[i]);
        } else {
            instances[currentInstance] = [];
        }

        oldInstance = currentInstance;
    }

    console.log(instances)
}

init();