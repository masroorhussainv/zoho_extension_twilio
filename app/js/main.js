function initializeWidget()
{

  function initializeTwilioConfig(config_data={}) {
    console.log('going to set up twilio now');
    console.log(config_data);
    TwilioNamespace.setUpTwilio(config_data)
    console.log('twilio set up initiated');
  }

  // Todo start
  // remove when extension is ready
  if(window.location.host.includes('127.0.0.1')) {
    window.__currentUserEmail = 'localhost'
    window.__twilioTargetPhoneNumber = "+12187520884"
    initializeTwilioConfig({currentUserEmail: window.__currentUserEmail});
  }
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
        window.__currentUserEmail = response.users?.[0]?.email || '';
        console.log('__currentUserEmail',window.__currentUserEmail);
        initializeTwilioConfig({currentUserEmail: window.__currentUserEmail});
      });

  })
  /*
   * initialize the widget.
   */
  ZOHO.embeddedApp.init();
}
