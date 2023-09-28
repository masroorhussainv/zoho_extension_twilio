function initializeWidget()
{
  // Todo start
  // remove when extension is ready
  // if(window.location.host.includes('127.0.0.1')) {
  //   window.__currentUserEmail = 'localhost'
  //   window.__twilioTargetPhoneNumber = "+12187520884"
  //   initializeTwilioConfig({currentUserEmail: window.__currentUserEmail});
  // }
  // Todo end

  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad",function(data)
  {
    console.log('pageload event executed');
    console.log('data passed to pageload', data)

    /*
      * Verify if EntityInformation is Passed
      */
    if(data && data.Entity)
    {
      /*
        * Fetch Information of Record passed in PageLoad
        * and insert the response into the dom
        */
      ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
        .then(function(response)
        {
          console.log('getRecord callback response', response);
          // document.getElementById("recordInfo").innerHTML = JSON.stringify(response,null,2);
          window.__twilioTargetPhoneNumber = '';
          if(data.Entity == 'Contacts') {
            window.__twilioTargetPhoneNumber = response.data?.[0]?.['Phone']?.replace(/[ ()-]/g,'');
          }
          document.getElementById('twilio-target-phone-number').innerHTML = window.__twilioTargetPhoneNumber
          console.log('twilioTargetPhoneNumber', window.__twilioTargetPhoneNumber)
        });
    }

    /*
     * Fetch Current User Information from CRM
     * and insert the response into the dom
     */
    ZOHO.CRM.CONFIG.getCurrentUser()
      .then(function(response)
      {
        console.log('getcurrentuser', response);
        // document.getElementById("userInfo").innerHTML = JSON.stringify(response,null,2);
        // window.__currentUserEmail = response.users?.[0]?.email || '';
        // console.log('__currentUserEmail',window.__currentUserEmail);
        // initializeTwilioConfig({currentUserEmail: window.__currentUserEmail});
      });

  })

  ZOHO.embeddedApp.on("DialerActive",function(){
    console.log("Dialer Activated");
  })

  ZOHO.embeddedApp.on("Dial",function(data){
    console.log("Number Dialed");
    // console.log(typeof(data))
    // console.log(data.Number)
    // console.log(data['Number'])
    if(data.Number) {
      console.log('---------------')
      console.log('data.Number', data.Number)
      let $phoneNumberField = $("#phone-number");
      console.log($phoneNumberField)
      $phoneNumberField.val(data.Number)
      console.log($phoneNumberField.val())
    }
    // console.log('data', data);
    console.log('---------------')
  })

  /*
   * initialize the widget.
   */
  ZOHO.embeddedApp.init();
}
