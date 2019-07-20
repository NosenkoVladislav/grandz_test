let radioInputListener = () => {
    const input = document.getElementsByName('delivery');
    const shipping = document.getElementById('shipping');
    let requiredEle = shipping.querySelector('#address');
    for(let i = 0; i < input.length; i++) {
        input[i].onclick = (e) => {
            if(e.target.id == 'mail_delivery') {
                shipping.classList.remove('hidden');
                requiredEle.dataset.rule='required';
            } else {
                shipping.classList.add('hidden');
                requiredEle.dataset.rule='nonrequired';
            }
        }
    }
};

radioInputListener();


let formValidation = (e) => {
    const form = document.getElementById('mainForm');
    const inputs = form.getElementsByClassName('form-input');
    const btn = document.getElementsByTagName('button')[0];

    let rules = {
        required: (elem) => {
            if(elem.value !='') {
                return true
            } else
                return false
        },
        email: (elem) => {
            let reg = /^\w{1,}@\w{1,}\.\w{1,}$/;
            return reg.test(elem.value);
        },
        phone: (elem) => {
            let phoneNum = /^\d{10}$/;
            if(elem.value.match(phoneNum)) {
                return true
            } else {
                return false
            }
        },
        nonrequired: (elem) => {
            return true
        }
    }

    btn.onclick = (e) => {
        e.preventDefault();
        let errors = [];
        for(let i = 0; i < inputs.length; i++) {
            let ruleList = inputs[i].dataset.rule;
            ruleList = ruleList.split(' ');
            for(let j = 0; j < ruleList.length; j++) {
                if(ruleList[j] in rules) {
                    if(!rules[ruleList[j]](inputs[i])) {
                        errors.push({
                            name: inputs[i].name,
                            error: ruleList[j],
                            value: inputs[i].value
                        });
                        inputs[i].classList.add('error')
                    } else (
                        inputs[i].classList.remove('error')
                    )
                }
            }
        }

        if(errors.length > 0) {
            // console.log(errors)
        } else {
            formSerialize(form);
            form.reset();
        }
    }
}

formValidation();

let formSerialize = (form) => {
    let object = {};
    let fields = form.querySelectorAll('input');
    for(let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let fieldName = field.name;
        let fieldVal = field.value;
        if(fieldName) {
            if(field.type == 'radio') {
                if(field.checked) {
                    object[ fieldName ] = fieldVal
                }
            } else {
                object[ fieldName ] = fieldVal
            }
        }
    }
    createRequest(object, 'sendForm');
}

let createRequest = (incomeData, event) => {
    let data = JSON.stringify(incomeData);
    let request = new XMLHttpRequest();

    request.open("POST", "/" + event, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        displayData(request.response)
    });
    request.send(data);
}

let displayData = (data) => {
    let receivedData = JSON.parse(data);
    for ( let i = 0; i < receivedData.length; i++) {
        for (let [key, value] of Object.entries(receivedData[i])) {
            createRespWrapper(key, value);
        }
    }
}

let createRespWrapper = (respKey, respVal) => {
    let respBlock = document.getElementById('apiReq');
    let block = document.createElement('div');
    block.classList.add('resp-wrap');
    block.innerHTML = `${respKey}: ${respVal}`;
    respBlock.append(block);
}
