function initializeWidget()
{
  ZOHO.embeddedApp.on("APP.SDK.INITIALIZED", function() {
    console.log("Zoho Embedded SDK version 1.2 initialized");
    // Any other code that should run after SDK initialization
  });

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
    console.log('Stored current_dialer_phone_number: ', crmDialedPhoneNumber.get());
    setDialerPhoneNumber();
    crmDialedPhoneNumber.set(null);
  });

  ZOHO.embeddedApp.on("Dial",function(data){
    console.log("Number Dialed");
    if(data.Number) {
      console.log('---------------');
      console.log('data.Number', data.Number);
      let number = data.Number;
      if(!number.startsWith('+')) {
        number = '+' + number;
      }
      crmDialedPhoneNumber.set(number);
      setDialerPhoneNumber();
      // let $phoneNumberField = crmDialedPhoneNumber.get();
      // console.log(crmDialedPhoneNumber.get());
      // $phoneNumberField.val(crmDialedPhoneNumber.get());
      // console.log(crmDialedPhoneNumber.get());
      // console.log('---------------');
    }
  })

  // TODO: remove start
  crmDialedPhoneNumber.set(0);
  crmDialedPhoneNumber.set(1);
  // TODO: remove end

  /*
   * initialize the widget.
   */
  ZOHO.embeddedApp.init({
    client_id: '1000.RUZQ7KB5YE04NKUWTECGNJ2NIRRA0L',
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL', // Adjust the scope as needed
    version: '2.1' // Use the appropriate version
  });
}
