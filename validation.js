
// Đối tượng validation
function validation(options){
    var selectorRules = {};

    var formElement = document.querySelector(options.form);

    function validate (errorElement,rule){
        var inputElement = formElement.querySelector(rule.selector);
                var errorMessage  = rule.test(inputElement.value);
                var rules = selectorRules[rule.selector];
                for( var i = 0;i< rules.length;i++){
                    errorMessage = rules[i](inputElement.value);
                    if(errorMessage){break}
                }
                    if(errorMessage){
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid')
                    } else{
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid')
                    }
                
                return !errorMessage;
                
            }
    // Lấy elements form cần validate
    if(formElement){

        // Lặp qua mỗi rule xử lí input, blur.....
        formElement.onsubmit = function(e){
            var isFormValid = true;

            // Ngăn chặn hành vi submit mặc Định
            e.preventDefault();
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule)
                if(!isValid){
                    isFormValid = false;
                }
            })

            var enableValid = formElement.querySelectorAll('[name]')

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var formValues = Array.from(enableValid).reduce(function(values,input){
                        return (values[input.name] = input.value) && values;
                    },{})
    
                    options.onSubmit(formValues)
                }else{
                    e.onSubmit()
                }
            }
        }
        options.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.selector);

            // Lưu lại các rule mỗi option
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
            
            // Xử lí blur ra khỏi input
            if(inputElement){
                var errorElement = inputElement.parentElement.querySelector('.form-message');
                inputElement.onblur = function(){
                    validate(errorElement,rule);
                }
            // Xử lí khi nhập vào input
                inputElement.oninput = function(){
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

// Định nghĩa các rule

validation.isRequired = function(selector){
    return{
        selector:selector,
        test:function(value){
            return value.trim() ? undefined: 'Vui lòng nhập thông tin'
        }
    }
}

validation.isEmail = function(selector){
    return{
        selector:selector,
        test:function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined: 'Trường này phải là email'
        }
    }
}

validation.isPassword = function(selector,min){
    return{
        selector:selector,
        test:function(value){
            return value.length >=  min ? undefined : `Bạn phải nhập tối thiểu ${min} kí tự!`;
        }
    }
}

validation.isConfirm = function(selector, getConfirmValue,message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue()? undefined : message ||'Giá trị nhập vào không chính xác'
        }
    }
}