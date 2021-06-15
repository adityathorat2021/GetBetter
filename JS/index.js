"use strict"

let displayMsgCount = 0;

// ------ Ask Us Section ------------ //
function formValidation()
{
    let validateValue = validate();
    let timestamp = logMsgDate();
    if (validateValue === true)
    {
        alert("We're delighted to here from you and your question will be answered shortly");
        displayVisitersMsg(timestamp);
        document.getElementById('message').value = '';
    }
}
function logMsgDate() {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    let currentDay = String(currentDate.getDate()).padStart(2, '0');
    let todaysDate = currentDay + '-' + currentMonth + '-' + currentYear ;
    return todaysDate;
}
function validate() 
{
    let firstNameString = document.getElementById('firstName').value;
    let lastNameString = document.getElementById('lastName').value;
    let emailString = document.getElementById('emailId').value;
    let numberString = document.getElementById('contactNumber').value;
    let messageString = document.getElementById('message').value;
    let namePattern = /^[A-Za-z]{3,}$/;
    let emailPattern = /^[A-Za-z0-9._]{3,}@[A-Za-z0-9]{3,}.[A-Za-z.]{1,}$/;
    let contactNumberPattern = /^[0-9]{10}$/;
    let validFirstName = namePattern.test(firstNameString);
    let validLastName = namePattern.test(lastNameString);
    let validEmail = emailPattern.test(emailString);
    let validNumber = contactNumberPattern.test(numberString);

    if (validFirstName == false || validLastName == false)
    {
        alert('Please enter your correct name');
        return false;
    }
    if (validEmail == false)
    {
        alert('Please provide a valid email ID');
        return false;
    }
    if (validNumber == false) 
    {
        alert('Please provide us a correct 10 digit mobile number');
        return false;
    }

    localStorage.setItem(firstNameString, messageString);
    return true;
}

// -------------- Display Visitors Messages -----------------//

function displayVisitersMsg(timestamp) 
{
    displayMsgCount++;
    let visiterName = localStorage.key(0);
    let visiterMessage = localStorage.getItem(visiterName);

    let newElementNameLabel = document.createElement('h3');
    newElementNameLabel.textContent = visiterName + ' '+ timestamp;
    newElementNameLabel.id = 'displayVisiterName' + displayMsgCount;
    newElementNameLabel.className = 'text-warning text-uppercase';

    let parentElement = document.getElementById('displayVisitersMsg');
    parentElement.appendChild(newElementNameLabel);

    let newElementMsgLabel = document.createElement('p');
    newElementMsgLabel.textContent = visiterMessage;
    newElementMsgLabel.id = 'displayVisiterMsg' + displayMsgCount;
    newElementMsgLabel.className = 'text-dark text-lowercase';

    let childElement = document.getElementById('displayVisiterName' + displayMsgCount);
    childElement.appendChild(newElementMsgLabel);

    if (displayMsgCount >= 3) 
    {
        document.getElementById('submitButton').disabled = true;
        localStorage.clear();
    }
}

// ------------------ Nutrition Data Display---------------//

function nutritionData() 
{
    let foodItem = document.getElementById('foodItem').value;
    let foodItemPattern = /^[A-Za-z]{3,}$/;
    let foodItemStringCheck = foodItemPattern.test(foodItem);
    if( foodItem == '' || foodItemStringCheck == false)
    {
        alert('Please enter an appropriate food item');
    }
    else 
    {
        let xmlRequest = new XMLHttpRequest();
        let URL = 'https://nutritionix-api.p.rapidapi.com/v1_1/search/' + foodItem + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat';
        xmlRequest.open('GET', URL, true);
        xmlRequest.setRequestHeader("x-rapidapi-host", "nutritionix-api.p.rapidapi.com");
        xmlRequest.setRequestHeader("x-rapidapi-key", "229030cd2amshe295d85661f5977p191627jsn129655f55188");
        xmlRequest.onload = function() 
        {
        let data = JSON.parse(this.response);
        let responseLastIndex = Object.keys(data.hits).length - 1;
        if(xmlRequest.status >= 200 && xmlRequest.status < 400) 
        {
            let nDataCount = 0;
            nutritionDataValues(0); 
            document.getElementById('foodItem').value = '';
            document.getElementById('prevButton').addEventListener("click", function(event)
            {
                event.preventDefault();
                if(nDataCount <= 0) 
                    nutritionDataValues(0);
                else 
                {
                    nutritionDataValues(nDataCount-1);
                    nDataCount--;
                } 
            });

            document.getElementById('nextButton').addEventListener("click", function(event)
            {
                event.preventDefault();
                if(nDataCount == responseLastIndex)
                {
                    nutritionDataValues(nDataCount);
                    nDataCount = responseLastIndex;
                }
                else 
                {
                    nutritionDataValues(nDataCount+1);
                    nDataCount++;
                }
            });

            function nutritionDataValues(index) 
            {
                document.getElementById('foodItemName').innerText = data.hits[index].fields.item_name;
                document.getElementById('calories').innerText = data.hits[index].fields.nf_calories;
                document.getElementById('fats').innerText = data.hits[index].fields.nf_total_fat;
                document.getElementById('serveSize').innerText = data.hits[index].fields.nf_serving_size_qty;
                document.getElementById('brandName').innerText = data.hits[index].fields.brand_name;  
            }        
        }
        else 
            alert('Server Error : ' + this.response.status + 'data could not be fetched. Please enter the food item again');
        }
        xmlRequest.send();
    }
    }

//------------ To reset Nav bar----------------//

$('document').ready(function () 
{ 
    $('.navbar-toggler-icon').click(function ()
     {
        $('a').click(function () 
        {
            if (($('.navbar-toggler').attr("aria-expanded")) == 'true')
                $('#collapseHomeNavbar').collapse('hide');
        })
    })
})
