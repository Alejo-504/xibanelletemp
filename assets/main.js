class Page {
  constructor() {
      this.params = {
          scroll: { 
              top: 150, 
              bottom: function() {
                  return document.querySelector(".footer-custom");
              },
              on: "",
          },
          class_play_video_btn: "playBtn"
      };
      this.events = {
          "ready:owl": new CustomEvent("ready:owl"),
          "ready:bootstrap": new CustomEvent("ready:bootstrap"),
          "scroll:header": new CustomEvent("scroll:header"),
          "scroll:body": new CustomEvent("scroll:body"),
          "scroll:footer": new CustomEvent("scroll:footer")
      };
      this.dispatch_register = {
          "ready:bootstrap": false
      }
      document.addEventListener("ready:bootstrap", () => {
          this.dispatch_register["ready:bootstrap"] = true;
      })
  }
  emit(name){
      document.dispatchEvent(this.events[name]);
  }
  getOffsetTop(element) {
    var offsetTop = 0;
    while(element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
  }
  #dispatch_scroll_events(header=true, body=true, footer=true){
      let scroll = window.scrollY;
      let footerPos = this.getOffsetTop(this.params.scroll.bottom());
      if (scroll <= this.params.scroll.top && header) {
          this.emit("scroll:header");
      }
      else if(footerPos - scroll <= window.innerHeight && footer){
          this.emit("scroll:footer");
      }
      else if(scroll > this.params.scroll.top && body){
          this.emit("scroll:body");
      }
      if(header || body || footer){
          window.addEventListener("scroll", () => {
              let scroll = window.scrollY;

             footerPos = this.getOffsetTop(this.params.scroll.bottom());


              if (scroll <= this.params.scroll.top && header) {
                  this.emit("scroll:header");
              }
              else if(footerPos - scroll <= window.innerHeight && footer){
                  this.emit("scroll:footer");
              }
              else if(scroll > this.params.scroll.top && body){
                  this.emit("scroll:body");
              }
              
          });
      }
  }
  initTooltips(){ // Bootstrap 5
      if(this.dispatch_register["ready:bootstrap"]){
          const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
          
          const tooltipList = [...tooltipTriggerList].map(
              tooltipTriggerEl => 
          
              new bootstrap.Tooltip(tooltipTriggerEl, {
                  html: true,
                  popperConfig: {
                   strategy: tooltipTriggerEl.dataset.strategy || 'absolute',
                  },
              }));
             
         
      }else{
          document.addEventListener("ready:bootstrap", () => {
              this.initTooltips();
          })
      }
  }
  set lazy_backgrounds(name_class){
      var lazyBackgrounds = [].slice.call(document.querySelectorAll(name_class));
      if ("IntersectionObserver" in window) {
          let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
              entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                      entry.target.classList.add("visible");
                      lazyBackgroundObserver.unobserve(entry.target);
                  }
              });
          });
      
          lazyBackgrounds.forEach(function(lazyBackground) {
              lazyBackgroundObserver.observe(lazyBackground);
          });
      }
  } 
  set scroll_tracking(name_class){
      let scroll_tracking = document.querySelectorAll(name_class);
      
      document.addEventListener('scroll:header', ()=> {
          
     
          if (this.params.scroll.on != "header") {
              scroll_tracking.forEach(function(item) {
                  if (!item.classList.contains('in-top')) {
                      item.classList.add('in-top');
                  }
                  if (item.classList.contains('in-footer')) {
                      item.classList.remove('in-footer');
                  }
                  if (item.classList.contains('in-body')) {
                      item.classList.remove('in-body');
                  }
              });
   
              this.params.scroll.on = "header";
          }
         
      })
      document.addEventListener('scroll:body', ()=> {
          if (this.params.scroll.on != "body") {
              scroll_tracking.forEach(function(item) {
                  if (item.classList.contains('in-top')) {
                      item.classList.remove('in-top');
                  }
                  if (item.classList.contains('in-footer')) {
                      item.classList.remove('in-footer');
                  }
                  if (!item.classList.contains('in-body')) {
                      item.classList.add('in-body');
                  }
              });
              this.params.scroll.on = "body";
          }
      })
      document.addEventListener('scroll:footer', ()=>{
         
          if (this.params.scroll.on != "footer") {
              scroll_tracking.forEach(function(item) {
                  if (!item.classList.contains('in-footer')) {
                      item.classList.add('in-footer');
                  }
                  if (item.classList.contains('in-top')) {
                      item.classList.remove('in-top');
                  }
                  if (item.classList.contains('in-body')) {
                      item.classList.remove('in-body');
                  }
              });
              this.params.scroll.on = "footer";
          }
      })

      this.#dispatch_scroll_events();
  }
  set videoReproduction(playBtn){
      let playButtons = document.querySelectorAll(playBtn);
      playButtons.forEach(function(playButton) {
          let videoElem = playButton.parentNode.querySelector("video");
          playButton.addEventListener("click", () => {
              handlePlayButton(playButton, videoElem);
          }, false);
  
          videoElem.onended = () => {
              playButton.style.display = "block";
              document.body.classList.remove("video-play");
              videoElem.controls = false;
          }
      });
  
      async function playVideo(playButton, videoElem) {
          try {
              await videoElem.play();
              playButton.style.display = "none";
              document.body.classList.add("video-play");
          } catch (err) {
              playButton.style.display = "block";
              document.body.classList.remove("video-play");
          }
      }
      function handlePlayButton(playButton, videoElem) {
          playVideo(playButton, videoElem);
          videoElem.controls = true;
      }
      // VIDEO REPRODUCCION
  }
  set scroll_to_section(section){
      let el = document.querySelector('[data-scroll="' + section + '"]');
      if (el) {
          el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
          });
      }
  }
}

let page = new Page();
function getParameterByName() {
  let url = window.location.href;
  let url_split = url.split('#');
  if (url_split.length > 1) {
      let param = url_split[1];
      if (param.includes('http')) {
          param = param.split('/');
          param = param[param.length - 1];
      }
      return param;
  } else {
      return false;
  }
}
document.addEventListener('DOMContentLoaded', function () { 
  page.scroll_tracking = ".scroll-tracking";
  page.lazy_backgrounds = ".lazy-background";
  page.scroll_to_section= getParameterByName();
  document.body.classList.add('dom-load');
  page.initTooltips();
})

