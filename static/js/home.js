backgroundCounter = 0;

$(document).ready(function(){
  ScrollerBehavior();
  setTimeout(playDoughSetup, 5000);
  enableGetStarted();
});

function ScrollerBehavior()
{
  topPos = $(document).scrollTop();
  numWindows = 100*(topPos/parseFloat($(window).outerHeight()));
  numWindows = Math.round(numWindows)/100.0;
  if(numWindows < 0.7){
    if($(".header").hasClass("opaqueHeader")){
      $(".header").removeClass("opaqueHeader");
      $(".header").addClass("transHeader");
    }
  }
  else{
    if($(".header").hasClass("transHeader")){
      $(".header").removeClass("transHeader");
      $(".header").addClass("opaqueHeader");
    }
  }
  window.requestAnimationFrame(ScrollerBehavior);
}

function playDoughSetup(){
  //background:url('../images/evocImg1.jpg');
  // console.log("I am in playdough");
  fileNames = ["evocImg1.jpg", "money.jpg", "dashprac.png"];

  backgroundCounter += 1;
  if(fileNames.length <= backgroundCounter){
    backgroundCounter = 0;
  }

  url = "url('static/images/" + fileNames[backgroundCounter] + "')";
  //url = "url('images/dashprac.png')";
  
  $(".playdough").css("background-image", url);

  $('.caption').removeClass('active');
  $('.caption:eq(' + backgroundCounter + ')').addClass('active');

  x = 5;  // 5 Seconds
  setTimeout(playDoughSetup, x*1000);
}


function enableGetStarted()
{
  $("button.CTA").click(function(e){
    document.getElementById("overlay").style.display = "block";
    btnID = $(this).attr("id");
    gtag('event', 'start', {'event_category' : 'CTA','event_label' : btnID});
    // gtag('send', 'event', 'CTA', 'start', btnID);
  });
  $(".closer").click(function(){
    document.getElementById("overlay").style.display = "none";
    gtag('event', 'signup', {'event_category' : 'CTA','event_label' : 'cancel'});
  });
  $('#btnSignup').click(function(){
    //nameVal, emailVal, specVal, roleVal
    gtag('event', 'signup', {'event_category' : 'CTA','event_label' : 'attempt'});
    var name = $('#nameVal').val().trim();
    var email = $("#emailVal").val().trim();
    var spec = $("#specVal").val().trim();
    var role = $("#roleVal").val().trim();

    if(email == ""){
      $("#emailValid").css("display", "block");
    }
    else if (spec == ""){
      $("#specValid").css("display", "block");
    }
    else if(role == ""){
      $("#roleValid").css("display", "block");
    }
    else{
      SaveData(name, email, spec, role);
      gtag('event', 'signup', {'event_category' : 'CTA','event_label' : 'success'});
    }
  });

  $('#btnCancel').click(function(){
    document.getElementById("overlay").style.display = "none";
    gtag('event', 'signup', {'event_category' : 'CTA','event_label' : 'cancel'});
  });
}

function SaveData(nameVal, emailVal, specVal, roleVal){
  $.ajax({
    method:"POST",
    url:"https://api.airtable.com/v0/app0ynzQLczVuCNz2/Table%201",
    beforeSend:function(xhr){
      xhr.setRequestHeader('Authorization','Bearer keyqXy9wVseyd2L6S');
      $("#btnSignup").attr("disabled","disabled");
      $("#btnCancel").attr("disabled","disabled");

    },
    contentType:"application/json",
    data:'{"fields": {"Email": "'+emailVal+'", "Name": "'+nameVal+'", "Specialty":"'+specVal+'", "Role":"'+roleVal+'"}}'
  })
  .done(function(msg){
    console.log("Everything has stuff in it.");
      document.getElementById("overlay").style.display = "none";
      $("button.CTA").attr("disabled", "disabled");
      $("button.CTA").css("background-color", "#909090");
      $("button.CTA").text("Thanks for signing up!");
  })
  .always(function(msg){
    console.log(msg);
  });

}
