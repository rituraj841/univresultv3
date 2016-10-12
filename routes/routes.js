var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var mModel = mongoose.model('marksModel');
var userModel = mongoose.model('User');
var qModel = mongoose.model( 'quizModel' );

exports.loginFormHandler = function (req, res){
	res.render('login.handlebars', {});
};//loginPageHandler

exports.authHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var loginOutcome;
// mModel.findOne
	userModel.findOne({username:nmReq}, function(err, userObj){
	    if(userObj === null){
	     	loginOutcome = "Login Failed: Username does not exist.";
        console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
	     	res.render('login.handlebars', {LoginMessage:loginOutcome});
	    } else {  //userObj is Not NULL
	    	if(pwdReq === userObj.password) {
	    		loginOutcome = "Login successful";
          req.session.authenticated = true;        
          req.session.loggedinUser = nmReq;
          console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);

          if(nmReq === "admin"){
            req.session.rollInSession = 'NA';            
            req.session.isAdmin = true;
          }else{
            req.session.rollInSession = userObj.rollnumber;            
            req.session.isAdmin = false;
          }
          res.render('landingpage.handlebars',
            {welcomeMessage:loginOutcome,
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,    ////req.session.studentInSession
            LOGGED_USER_NAME: req.session.loggedinUser
          });

				} else{
				  loginOutcome = "Login Failed: Password did not match.";
          console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
          res.render('login.handlebars', {LoginMessage:loginOutcome});
		    }
		  }//userObj is Not NULL

	});//findOne
}; //authHandler

exports.logoutHandler = function (req, res){
  req.session.destroy();
  res.render('login.handlebars', {LoginMessage:"You have successfully logged out."});
};//loginPageHandler

exports.registerFormHandler = function(req, res){
   res.render("register.handlebars", {});
}; //registerFormHandler

exports.registerUserHandler = function(req, res){
   var usernameReq = req.body.username;
   var genderReq = req.body.gender;
   var emailReq = req.body.email;
   var studentmobileReq = req.body.studentmobile;
   var dobReq = req.body.dob;
   var fnameReq = req.body.fname;
   var mnameReq = req.body.mname;
   var parentmobileReq = req.body.parentmobile;
   var addressReq = req.body.address;
   var flatReq = req.body.flat;
   var landmarkReq = req.body.landmark;
   var cityReq = req.body.city;
   var pincodeReq = req.body.pincode;
   var stateReq = req.body.state;
   var rollnumberReq = req.body.rollnumber;
   var passwordReq = req.body.password;
   var newuser = new User();

   newuser.username = usernameReq;
   newuser.gender = genderReq;   
   newuser.email = emailReq;
   newuser.studentmobile = studentmobileReq;
   newuser.dob = dobReq;
   newuser.fname = fnameReq;
   newuser.mname = mnameReq;
   newuser.studentmobile = parentmobileReq;
   newuser.address = addressReq;
   newuser.flat = flatReq;
   newuser.landmark = landmarkReq;
   newuser.city = cityReq;
   newuser.pincode = pincodeReq;
   newuser.state = stateReq;
   newuser.rollnumber = rollnumberReq;
   newuser.password = passwordReq;

   //save to db through model
   newuser.save(function(err, savedUser){
       if(err){
         var message = "A user already exists with that username or email";
         console.log(message);
         res.render("register", {errorMessage:message});
         return;
       }else{
         req.session.newuser = savedUser.username;
         res.render('landingpage.handlebars', {welcomeMessage:"Registration succesful"});
       }
   });
};//registerUserHandler


exports.resultFormHandler = function(req, res){
   res.render("resultForm.handlebars",
          {IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            USER_ROLL:req.session.rollInSession,
            LOGGED_USER_NAME: req.session.loggedinUser});
}; //registerFormHandler
///////////crosslist mein b ye hi kam krna h//////////
exports.resultHandler = function(req,res){
  var rollReq = req.body.roll;
  console.log("resultPageHandler Roll" + rollReq);

  mModel.findOne({roll:rollReq}, function(err, mrksRec){
    if (!err && mrksRec != null){
     
      res.render('resultPage.handlebars', //Sends all data records from database to result show page////////////
          {marks:mrksRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }else{
      console.log("roll number not found");
      var message = "<span class='label label-danger'>Record not found. Check Your Roll Number</span>";
      res.render('landingpage.handlebars',
          {welcomeMessage:message,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});      
    } 

  });
}//resultHandler
///////////////////////I M WORKING HERE//////////////////////////////////////////////////////////////////
exports.marksEntryInitialForm = function(req, res){
   res.render("marksEntryInitForm.handlebars",
          { AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
};
exports.marksEntryForm = function(req,res){
  var rollnumberReq = req.body.rollnumber;
  // console.log("resultPageHandler rollnum" + rollReq);

  userModel.findOne({rollnumber:rollnumberReq}, function(err, userRec){
    if (!err && userRec != null){

      mModel.findOne({roll:rollnumberReq}, function(err, marksRec){
        if (!err && marksRec != null){
          var msg = "<span class='label label-danger'>This Student's marks record is already entered</span>";
          res.render('marksEntryInitForm.handlebars', 
          { ErrorMessage:msg,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
        }
        else{
          res.render('marksEntryForm.handlebars', //Sends all data records from database to marks entry show page////////////
          { user:userRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
        }
      });

    }else{
      console.log("roll number not found in user collection");
      var message = "<span class='label label-danger'>User record not found. Check Your Roll Number</span>";
          res.render('marksEntryInitForm.handlebars', 
          { ErrorMessage:message,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    } 


  });
}//resultPageHandler///////this is the original route.js file for marks entry page/////

// exports.marksEntryForm = function(req, res){
//    res.render("marksEntryForm.handlebars",
//           { AUTHENTICATED:req.session.authenticated,
//             IS_ADMIN:req.session.isAdmin,
//             LOGGED_USER_NAME: req.session.loggedinUser});
// }; //marksEntryForm

exports.marksEntry = function(req, res){
   var nameReq = req.body.nm;////req=request
   var rollReq = req.body.roll;
   var physicsReq = req.body.physics;
   var chemistryReq = req.body.chemistry;
   var mathsReq = req.body.maths;
   var computerReq = req.body.computer;

   console.log("name=%s roll=%s",nameReq, rollReq );
   console.log("physics=%s chem=%s maths=%s comp=%s",physicsReq, chemistryReq ,mathsReq ,computerReq );

   var newmarks = new mModel();
   newmarks.xname = nameReq;
   newmarks.roll = rollReq;
   newmarks.physics = physicsReq;
   newmarks.chemistry = chemistryReq;
   newmarks.maths = mathsReq;
   newmarks.computer = computerReq;
   newmarks.totalmarks = parseInt(newmarks.physics)
              + parseInt(newmarks.chemistry)
              + parseInt(newmarks.maths)
              + parseInt(newmarks.computer) ;
   var perc = (newmarks.totalmarks * 100)/400; 
   var div; 
   if (perc >= 60 ){
    div = "1st";
   }else if (perc >= 45){
    div = "2nd";
   }else if (perc >= 30 ){
    div = "3rd";
   }else {
    div ="fail";
   }
  newmarks.division = div;
  console.log(" Marks total=%s", newmarks.totalmarks);
   //save to db through model
   newmarks.save(function(errorx, savedRec){
       if(errorx){
         var message = "A entry already exists with that name or roll";
         console.log(message);
         res.render('landingpage.handlebars',
          {welcomeMessage:"Entry Submission failed",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }else{
         //req.session.newmarks = savedstudentsscorecard.marks;
         res.render('landingpage.handlebars',
          {welcomeMessage:"Entries Submitted succesfully",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }
   });
};//marksEntry


exports.crosslistHandler = function(req,res){
  var marksArray;
  mModel.find({}, function(err, mrksRec){
    if (!err && mrksRec != null){
      console.log(JSON.stringify(mrksRec));
      marksArrray = mrksRec;
      outcomeBoolean = 1;
      res.render('crosslist.handlebars',
          {marks:mrksRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }
  });//find
}


exports.StudentInformationHandler = function(req,res){
  var studentArray;
  userModel.find({}, function(err, userRec){
    if (!err && userRec != null){
      console.log(JSON.stringify(userRec));
      studentArrray = userRec;
      outcomeBoolean = 1;
      res.render('registeredstudents.handlebars',
          {candidate:userRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }
  });//find
}

/////////////////////////////ADD/EDIT/DELETE/SAVE CHANGES///////////////////////////////////////////////////

exports.deleteHandler = function(req, res){
  var rollToEdit = req.query.rollnumber; 
  mModel.remove({roll:rollToEdit}, function(err, marksRec){
  if (!err){
    var message = '<span class="label label-success">A record removed successfully</span>';
    res.render('landingpage.handlebars',           
          {welcomeMessage:message,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
  } 
}); //mModel.remove
}; //deleteHandler

exports.editPageHandler = function(req, res){
  var rollToEdit = req.query.rollnumber;
  mModel.findOne({roll:rollToEdit}, function(err, marksRec){
  if (!err){
    //console.log("Going to edit -> [" + marksRec.roll + " : " + marksRec.description + "]")  ;
    //var message = '<span class="label label-danger">update failed</span>';
    res.render('editPage.handlebars', {marksRec:marksRec, 
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
  } 
}); //mModel.findOne
}; //editPageHandler:marksRec

exports.saveChangesHandler = function(req, res){
  var rollRequest = req.body.roll;
  var phySubjRequest = req.body.physics;
  var chemSubjRequest = req.body.chemistry;
  var mathsSubjRequest = req.body.maths;
  var compSubjRequest = req.body.computer;
  //console.log("Saving Edited records : " + rollRequest + " : " + physicsSubjRequest);
  //update rec through model
  mModel.update({roll:rollRequest}, 
                    {$set: { physics: phySubjRequest, chemistry: chemSubjRequest, maths: mathsSubjRequest, computer: compSubjRequest}}, 
                    {multi:false}, function(err, updatedRec){
   if(err){
     var message = '<span class="label label-danger">Update Failed</span>';
     res.render('landingpage.handlebars', {welcomeMessage:message, 
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
              LOGGED_USER_NAME: req.session.loggedinUser});
   }else{
     var message = '<span class="label label-success">Update succesful</span>';
     res.render('landingpage.handlebars', {welcomeMessage:message, 
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
   }
  });
}; //saveChangesHandler

// exports.saveChangesHandler = function(req, res){
//     var rollRequest = req.body.roll;
//     var phySubjRequest = req.body.physics;
//     var chemSubjRequest = req.body.chemistry;
//     var mathsSubjRequest = req.body.maths;
//     var compSubjRequest = req.body.computer;
//     // var nameReq = req.body.name;////req=request
//    // var rollReq = req.body.roll;
//    // var physicsReq = req.body.physics;
//    // var chemistryReq = req.body.chemistry;
//    // var mathsReq = req.body.maths;
//    // var computerReq = req.body.computer;

//    // console.log("name=%s roll=%s",nameReq, rollReq );
//    // console.log("physics=%s chem=%s maths=%s comp=%s",physicsReq, chemistryReq ,mathsReq ,computerReq );

//    var updtmarks = new mModel();
//    // updtmarks.xname = rollRequest;
//    updtmarks.roll = rollRequest;
//    updtmarks.physics = phySubjRequest;
//    updtmarks.chemistry = chemSubjRequest;
//    updtmarks.maths = mathsSubjRequest;
//    updtmarks.computer = compSubjRequest
//    updtmarks.totalmarks = parseInt(updtmarks.physics)
//               + parseInt(updtmarks.chemistry)
//               + parseInt(updtmarks.maths)
//               + parseInt(updtmarks.computer) ;
//    var perc = (updtmarks.totalmarks * 100)/400; 
//    var div; 
//    if (perc >= 60 ){
//     div = "1st";
//    }else if (perc >= 45){
//     div = "2nd";
//    }else if (perc >= 30 ){
//     div = "3rd";
//    }else {
//     div ="fail";
//    }
//   updtmarks.division = div;
//   // console.log(" Marks total=%s", updtmarks.totalmarks);
//    //save to db through model
//    mModel.update({roll:rollRequest}, 
//                     {$set: { physics: phySubjRequest, chemistry: chemSubjRequest, maths: mathsSubjRequest, computer: compSubjRequest}}, 
//                     {multi:false}, function(err, updatedRec){
//    if(err){
//      var message = '<span class="label label-danger">Update Failed</span>';
//      res.render('landingpage.handlebars', {welcomeMessage:message, 
//             IS_ADMIN:req.session.isAdmin,
//             AUTHENTICATED:req.session.authenticated,
//               LOGGED_USER_NAME: req.session.loggedinUser});
//    }else{
//      var message = '<span class="label label-success">Update succesful</span>';
//      res.render('landingpage.handlebars', {welcomeMessage:message, 
//             IS_ADMIN:req.session.isAdmin,
//             AUTHENTICATED:req.session.authenticated,
//             LOGGED_USER_NAME: req.session.loggedinUser});
//    }
//   });
// }; //saveChangesHandler
// updtmarks.save(function(errorx, savedRec){
//        if(errorx){
//          var message = "A entry already exists with that name or roll";
//          console.log(message);
//          res.render('landingpage.handlebars',
//           {welcomeMessage:"Entry Submission failed",
//             AUTHENTICATED:req.session.authenticated,
//             IS_ADMIN:req.session.isAdmin,
//             LOGGED_USER_NAME: req.session.loggedinUser});
//        }else{
//          //req.session.newmarks = savedstudentsscorecard.marks;
//          res.render('landingpage.handlebars',
//           {welcomeMessage:"Entries Submitted succesfully",
//             AUTHENTICATED:req.session.authenticated,
//             IS_ADMIN:req.session.isAdmin,
//             LOGGED_USER_NAME: req.session.loggedinUser});
//        }
//    });
// };//marksEntry


exports.quizHandler = function(req, res){
   res.render("quizpage.handlebars",
          {IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            USER_ROLL:req.session.rollInSession,
            LOGGED_USER_NAME: req.session.loggedinUser});
}; //quizHandler

exports.quizSubmitHandler = function(req, res){
   var question1Req = req.body.qn-1;////req=request
   var question2Req = req.body.qn-2;
   // var question3Req = req.body.qn-3;
   // var question4Req = req.body.qn-4;
   // var question5Req = req.body.qn-5;
   
   // console.log("name=%s roll=%s",nameReq, rollReq );
   // console.log("physics=%s chem=%s maths=%s comp=%s",physicsReq, chemistryReq ,mathsReq ,computerReq );

   var newquiz = new qModel();
   newquiz.question1 = question1Req;
   newquiz.question2 = question2Req;
   // newquiz.question3 = question3Req;
   // newquiz.question4 = question4Req;
   // newquiz.question5 = question5Req;
   
   //save to db through model
   newquiz.save(function(errorx, savedRec){
       if(errorx){
         var message = "A entry already exists ";
         console.log(message);
         res.render('landingpage.handlebars',
          {welcomeMessage:"Entry Submission failed",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }else{
         //req.session.newmarks = savedstudentsscorecard.marks;
         res.render('quizpage.handlebars',
          {welcomeMessage:"Entries Submitted succesfully",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }
   });
};//marksEntry
