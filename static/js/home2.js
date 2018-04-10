backgroundCounter = 0;
var activeScene, windowHeight;
var slideIndex = 1;

// extension:
$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

$(document).ready(function(){
  ScrollerBehavior();
  enableGetStarted();
  showSlides(slideIndex);
  setVisibilityAnalytics();
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

function SetMenuScrollAnimation()
{
  $('li.link a')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event){
    gtag('event', 'Menu', {'event_category' : 'Navigation','event_label' : $(this).attr('id')});
    //console.log("inside animationFrame!");
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) 
    {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[id=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        scrollOffset = target.offset().top - $(".header").outerHeight();
        $('html, body').animate({
          scrollTop: scrollOffset
        }, 1000, function() {
        });
      }
    }
    $('li.link a').removeClass('activeMenuItem');
    $(this).addClass('activeMenuItem');
  });
}

function setVisibilityAnalytics(){
  activeScene = $(".playdough");
  activeSceneNum = -1;
  windowHeight = $(document).outerHeight();
  sceneHeight = $(".scene").outerHeight();
  offset = $(".header").outerHeight();
  // console.log("Window Height: " + String(windowHeight));
  // console.log("Header Height: " + String(offset));
  bounderies = [];
  sceneNames = ["Product", "Need"];
  $(".scene").each(function(index){
    sceneObj = {};
    sceneObj["topPosition"] = parseInt($(this).offset().top);
    sceneObj["bottomPosition"] = parseInt($(this).outerHeight() + $(this).offset().top);
    sceneObj["id"] = $(this).attr('id');
    bounderies.push(sceneObj);
  });

  // console.log(bounderies);
  // how to call it (with a 1000ms timeout):
  $(window).scrollEnd(function(){
    currScroll = $(window).scrollTop() + offset + 16;
    sceneNumber = returnScene(currScroll, bounderies);
    // console.log("Scroll ended: " + String(currScroll));
    if(sceneNumber != activeSceneNum){
      //console.log("Active scene changed!");
      activeSceneNum = sceneNumber;
      if(sceneNumber >= 0){
        //console.log("Current Scene is: " + sceneNames[sceneNumber]);
        //gtag('event', 'reading', {'event_category' : 'Consumption','event_label' : sceneNames[sceneNumber]});
      }
    }
  }, 1000);
}

function returnScene(currScroll, allScenes){
  currentSceneIndex = -1
  for (var i = 0, len = allScenes.length; i < len; i++) {
    if(currScroll<allScenes[i]["bottomPosition"] && currScroll>= allScenes[i]["topPosition"]){
      currentSceneIndex = i;
      break;
    }
  }
  //console.log("Current Scene Index: " + String(currentSceneIndex));
  return currentSceneIndex;
}


function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
