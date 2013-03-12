$(function() {
    
        $("theSubmitButton").prop('disabled', true);
            var username = $( "#username" ),
                password = $( "#password" ),
                allFields = $( [] ).add( username ).add( password ),
                tips = $( ".validateTips" );
     
            function updateTips( t ) {
                tips
                    .text( t )
                    .addClass( "ui-state-highlight" );
                setTimeout(function() {
                    tips.removeClass( "ui-state-highlight", 1500 );
                }, 500 );
            }
     
            function checkLength( o, n, min, max ) {
                if ( o.val().length > max || o.val().length < min ) {
                    o.addClass( "ui-state-error" );
                    updateTips( "Length of " + n + " must be between " +
                        min + " and " + max + "." );
                    return false;
                } else {
                    return true;
                }
            }
     
            function checkRegexp( o, regexp, n ) {
                if ( !( regexp.test( o.val() ) ) ) {
                    o.addClass( "ui-state-error" );
                    updateTips( n );
                    return false;
                } else {
                    return true;
                }
            }

            

            $( "#dialog-form" ).dialog({
                closeOnEscape: false,
                autoOpen: false,
                height: 310,
                width: 350,
                resizable: false,
                draggable: false,
                modal: true,
                id: "theDialog",
                buttons: {
                    Login: { 
                        text: "Login",
                        id: "LoginButton",      
                        click: function() {
                            var bValid = true;
                            allFields.removeClass( "ui-state-error" );
         
                            bValid = bValid && checkLength( username, "username", 3, 16 );
                            //bValid = bValid && checkLength( email, "email", 6, 80 );
                            bValid = bValid && checkLength( password, "password", 5, 16 );
         
                            bValid = bValid && checkRegexp( username, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
                            //From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                            //bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
                            bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
                            //"<td>" + name.val() + "</td>" + 
                            if ( bValid ) {
                                $( "#users tbody" ).append( "<tr>" +
                                    "<td>" + username.val() + "</td>" + 
                                    "<td>" + password.val() + "</td>" +
                                "</tr>" ); 
                                //$( this ).dialog( "close" );
                               // allFields.val( "" ).removeClass( "ui-state-error" );
                               allFields.removeClass( "ui-state-error" );
                                $('#loginForm').submit();
                                //$('#theSUbmitButton').trigger();
                                 //$('#theSubmitButton').submit();
                                 //$('#theSubmitButton').click();
                            }
                        }
                    }
                }
            });

            if($("#idHidden").val() == "" || $("#clientHidden").val() == "")
            {
                $( "#dialog-form" ).dialog( "open" );
            }


    });

    $('#username').keypress(function(event) {
        
        if ( event.which == 13 ) {
             $('#LoginButton').click();
       }

        
    });
    $('#password').keypress(function() {
        if ( event.which == 13 ) {
             $('#LoginButton').click();
       }
    });
