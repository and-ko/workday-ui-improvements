# Workday UI improvements and automation

## Disclaimer
Use this on your risk, I am not responsible for the wrong hours entered and any other possible issues.



## Features
* Selects the text in hours input fields. You don't have to manually delete pre-populated "0"
* Aligns the fields in a time entry dialog
* Automatically fills all the comments in a timesheet

### Time entry form before
Alignment is off. When you focus the "Hours" field, cursor goes after pre-populated "0".

<img alt="Time entry form before" src="https://github.com/user-attachments/assets/c31a1056-b5c8-4521-8641-46a09726b34c" width="461">

### Time entry form after
When you focus on the "Hours" field, it selects the value and you don't have to manually delete it.

<img alt="Time entry form after" src="https://github.com/user-attachments/assets/68210677-cc0c-4148-8e4e-38fecf5b905f" width="466">

### Populate comments form for multi-day time entry

Type your comments for the hours emtry in the from. Click the button to fill all the comments fields on a multi-day comments page. This form will also work on a single day time entry (screenshots above).
The app will save your comments locally in your browser for the future use.

<img alt="Autofill Form" src="https://github.com/user-attachments/assets/8c76f649-c7dc-455c-892b-438b6748eba1" width="230">

## Installation

1. Install [Tampermonkey Chrome extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en).
2. Go to the file [workday-ui.user.js](workday-ui.user.js) and click “Raw” button on the top right corner of the code box.
3. Tampermonkey will ask if you want to install this script.
4. Open Workday page. You should see a little box with a textarea and a button on the top left of the page. The box is draggable.

## Usage

1. Go to Workday &rarr; Enter My Time. You should see a form attached above on a top right corner.
1. Navigate to Actions&nbsp;&rarr;&nbsp;Enter time by&nbsp;type&nbsp;&rarr; Comments 0 of 5.
1. Put your comments in the textarea, and click big blue button. It will fill the comments fields on the page. Application will save your comments and you can use them next time.
1. Review the comments. You can change them manually.
1. Click Save.
 

 
