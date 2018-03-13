$(document).ready(function () {
    var landing = {
        state: {
            step: 1
        },
        execute: function () {
        //     this.initElems();
            this.bindEvents();
        },
        initElems: function () {
            this.header = document.querySelector('.js-landing-header');
            this.$regContainer = $('.js-reg-container');
            this.$progressBar = $('.js-progress-bar');
            this.$nextBtn = $('.js-btn-next');
            this.$prevBtn = $('.js-btn-prev');
            this.searchGender = document.querySelector('.js-search');
            this.gender = document.querySelector('.js-gender');
            this.$regStep = $('.js-reg-step');
            this.$emailError = $('.js-error__email');
            this.$email = $('.js-email');
            this.$passError = $('.js-error__password');
            this.$pass = $('.js-password');
            // this.hideEmailErrors = document.querySelectorAll('.js-hide-error');

            this.bDay = document.querySelector('.js-dayB');
            this.selectDay = document.querySelector('.js-day-item');
            this.month = document.querySelector('.js-month');
            // this.$progressItem = $('.js-progress-item.active');
        },
        showError: function (error) {
            $(this.header).addClass('hide-element');
            $(error).addClass('show');
        },
        hideError: function (error) {
            $(this.header).removeClass('hide-element');
            $(error).removeClass('show');
        },
        bindEvents: function () {
            var self = this;
            var regStep = ".js-reg-step";
            var progressItem = ".js-progress-item";
            this.$nextBtn.off()
                .on('click', function () {

                    var currentStep = config[self.state.step];
                    if (typeof currentStep.checkStatus !== 'function') {
                        showNextStep(self.state.step + 1);
                        return;
                    }

                    var statusValid = currentStep.checkStatus(config[self.state.step].el);
                    if (!statusValid) {
                        console.log("false");
                        switch (self.state.step){
                            case 5:
                                if(!(currentStep.checkEmailValid(config[self.state.step].el[0].value))){
                                    self.header.classList.add('hide-element');
                                    self.$email.addClass('error-state');
                                    self.$emailError.addClass('show');
                                    return;
                                }
                                if(currentStep.checkEmailValid(config[self.state.step].el[0].value)){
                                    self.header.classList.remove('hide-element');
                                    self.$email.removeClass('error-state');
                                    self.$emailError.removeClass('show');
                                    currentStep.mailFire(config[self.state.step])
                                }
                                if(!(currentStep.checkPassLength(config[self.state.step].el[1].value.length < 8))){
                                    self.header.classList.add('hide-element');
                                    self.$pass.addClass('error-state');
                                    self.$passError.addClass('show');
                                    return;
                                }
                                break;
                        }
                        self.showError(config[self.state.step].error);
                        console.log(currentStep);
                        return;
                    }

                    self.hideError(config[self.state.step].error);
                    showNextStep(self.state.step + 1);
                    switch (self.state.step){
                        case 4:
                            $(self.$regContainer).addClass('middle-container');
                            break;
                        case 5:
                            $(self.$regContainer).addClass('big-container');
                            break;
                        case 6:
                            $(self.$emailError).removeClass('show');
                            $(self.$progressBar).removeClass('progress-bar');
                            break;
                    }


                });
            this.$prevBtn.on('click', function () {
                    showNextStep(self.state.step - 1);
                switch (self.state.step){
                    case 3:
                        $(self.$regContainer).removeClass('middle-container');
                        break;
                    case 4:
                        $(self.$regContainer).removeClass('big-container');
                        break;
                }
            });

            function showNextStep(nextStep) {
                $(progressItem + '[data-progress=' + self.state.step + ']').removeClass('active');
                $(regStep + '[data-step=' + self.state.step + ']').removeClass('active');


                $(progressItem + '[data-progress=' + nextStep + ']').addClass('active');
                $(regStep + '[data-step=' + nextStep + ']').addClass('active');

                self.state.step = nextStep;
            }
        }
    };

    var config = {
      1 : {
          checkStatus: function (item) {
              console.log(landing.gender);
              console.log("FIRST");
              for(var i = 0; i < item.length; i++){
                  if(item[i].innerHTML.trim() === ""){
                      item[i].classList.add('error-state');
                      return false;
                  }
              }
              var chooseGender = document.querySelector('.js-gender');
              var finGender = document.querySelector('.fin_gender').value = chooseGender.dataset.gender;
              var searchGender = document.querySelector('.js-search');
              var finSearchGender = document.querySelector('.fin_search_gender').value = searchGender.dataset.gender;

              return true;
          },
          el: [document.querySelector('.js-gender'), document.querySelector('.js-search')],
          error: '.js-error__search'
      },
      2: {
          checkStatus: function (item) {
              for(var i = 0; i < item.length; i++){
                  if(item[i].innerText.trim() === "ДД" || item[i].innerText.trim() === "ММ" || item[i].innerText.trim() === "ГГГ"){
                      item[i].classList.add('error-state');
                      return false;
                  }
              }

              var chooseDay = document.querySelector('.js-day-item').dataset.day;
              var chooseMonth = document.querySelector('.js-month-item').dataset.month;
              var chooseYear = document.querySelector('.js-year-item').dataset.year;

              var bDay = ""+chooseYear+"-"+chooseMonth+"-"+chooseDay+"";
              var finBday = document.querySelector('.bday').value = bDay;

              return true;
          },
          el: [document.querySelector('.js-day-item'), document.querySelector('.js-month-item'), document.querySelector('.js-year-item')],
          error: '.js-error__b-day'
      },
        3: {
            checkStatus: function (item) {
                    if($(item).val().length < 3){
                        $('.js-form-name').addClass('error-state');
                        return false;
                    }
                    var name = document.querySelector(".form-name").value;
                    var finName = document.querySelector(".fin_name").value = name;
                return true;
            },
            el: document.querySelector('.form-name'),
            error: '.js-error__name'
        },
        4: {
            checkStatus: function () {

                return true;
            }
        },
        5: {
          hideAllEmailErrors: function () {
              var hideEmailErrors = document.querySelectorAll('.js-hide-error');
              for(var i = 0; i < hideEmailErrors.length; i++){
                  hideEmailErrors[i].classList.add('js-hide-error');
              }
          },
          mailFire: function () {
              var self = this;
              var $email = $('#email').val();
              self.hideAllEmailErrors();

              $.ajax({
                  url: "/restapi/sign/checkemail?email="+$email+"&product_id="+1,
                  method: "GET",
                  success: function (data) {
                      var statusRes = data.response.status;
                      var fixedEmail = data.response.fixed_email;

                      switch (statusRes) {
                          case 3:
                              $(hideElements).addClass("js-error-hide");
                              $(".js-email-type-two, .js-email-type-zero").addClass("js-error-hide");
                              $(".js-email-type-three").removeClass("js-error-hide");
                              break;
                          case 2:
                              $(hideElements).addClass("js-error-hide");
                              $(".js-email-type-three, .js-email-type-zero").addClass("js-error-hide");
                              $(".js-email-type-two").removeClass("js-error-hide");
                              break;
                          case 0:
                              if (fixedEmail) {
                                  $("#email").val(fixedEmail);
                                  $(hideElements).addClass("js-error-hide");
                                  $(".js-email-type-two, .js-email-type-three").addClass("js-error-hide");
                                  $(".js-email-type-zero").removeClass("js-error-hide");
                                  return;
                              }

                              $(".valid-email").addClass("js-error-hide");
                              $("#fin_email").val(email);
                              is_field_empty('email');
                              break;
                      }
                  },
                  error: function () {

                  }
              })
          },
            checkEmailValid: function (email) {
                    var reg = /^[A-z0-9_-]+([\.+-]?[A-z0-9_-]+)*@(?!_)[A-zА-я0-9]+([\.-]?[A-zА-я0-9_-]+)*(\.[A-zА-я0-9_-]{2,10})+$/;
                    if (!reg.test(email)) {
                        return false;
                    }
                    return true;
            },
            checkPassLength: function (pass) {
                if(pass < 8){
                    return false;
                }
                return true;
            },
            checkStatus: function (item) {
              var self = this;
                if(!(self.checkEmailValid(item[0].value))){
                    console.log("EMAIL");
                    return false;
                }else if($(item[1]).val().length < 8){
                    $('.password').addClass('error-state');
                    return false;
                }
                return true;
            },
            el: [document.querySelector('.js-form-email'), document.querySelector('.js-form-password')],
            error: '.js-error__password'
        },
        6: {
            checkStatus: function () {

                return true;
            }
        }
    };
    landing.initElems();

    // End change Step

    function open(item) {
        $(item).removeClass('closed').addClass('open');
    }
    function close(item) {
        $(item).removeClass('open').addClass('closed');
    }
    function dataSetAttribute(elem, obj) {
        for(var key in obj){
            return elem[key] = obj[key];
        }
    }

    // Function for open selectors
    function openSelector(selector, option) {
        selector.onclick = function (e) {
            var target = e.target;
            if (target.className === 'selector-item') {
                option.innerText = target.innerHTML;
                dataSetAttribute(option.dataset, target.dataset);
            }

            if ($(this).hasClass('open')) {
                close(this);
                return;
            }
            open(this);
        };
    }
    // End function for open selectors


    // First step
    // Variables for first step
    var searchGender = document.querySelector('.js-search-gender');
    var selector = document.querySelector('.js-search');
    var gender = document.querySelector('.js-own__gender');
    var selectorGender = document.querySelector('.js-gender');
    // end variables for first step

    // $('.js-reg-step-one').on('click change', function () {
        openSelector(searchGender, selector);
        openSelector(gender, selectorGender);
    // });
    // End first step

    // Second step
    // Create variables
    var bDay = document.querySelector('.js-dayB');
    var selectDay = document.querySelector('.js-day-item');
    var month = document.querySelector('.js-month');
    var selectMonth = document.querySelector('.js-month-item');
    var year = document.querySelector('.js-year');
    var selectYear = document.querySelector('.js-year-item');
    var familyStatus = document.querySelector('.js-family-status');
    var statusText = document.querySelector('.js-status-text');

        openSelector(bDay, selectDay);
        openSelector(month, selectMonth);
        openSelector(year, selectYear);
        openSelector(familyStatus, statusText);
    // End second step

    //Four step
    var growth = document.querySelector('.js-growth');
    var growthSelected = document.querySelector('.js-growth-selected');
    var constitution = document.querySelector('.js-constitution');
    var constitutionSelected = document.querySelector('.js-constitution-selected');
    var eye = document.querySelector('.js-eye');
    var eyeSelected = document.querySelector('.js-eye-selected');
    var hair = document.querySelector('.js-hair');
    var hairSelected = document.querySelector('.js-hair-selected');
    var hairLength = document.querySelector('.js-hair-length');
    var hairLengthSelected = document.querySelector('.js-hair-length-selected');

    openSelector(growth, growthSelected);
    openSelector(constitution, constitutionSelected);
    openSelector(eye, eyeSelected);
    openSelector(hair, hairSelected);
    openSelector(hairLength, hairLengthSelected);
    //End four step

    var passType = $('.js-form-password');
    var $eyeHide = $('.pass-hide');
    var $eyeShow = $('.pass-show');
    //Pass change
    $($eyeHide).on('click', function () {
       $(this).removeClass('active');
       $($eyeShow).addClass('active');
       $(passType).prop('type', 'password');
    });
    $($eyeShow).on('click', function () {
        $(this).removeClass('active');
        $($eyeHide).addClass('active');
        $(passType).prop('type', 'text');
    });
    //End pass change

    //Hide error
    var $regSelect = $('.js-reg-select');
    var $selector = $('.js-selector');
    var $landError = $('.landing__error');
    var $head = $('.js-landing-header');

    function hideError() {
        $selector.removeClass('error-state');
        $landError.removeClass('show');
        $head.removeClass('hide-element');
    }
    $regSelect.on('click', function(e){
        var target = e.target;
        if($(target).hasClass('selector-item')){
            if($selector.hasClass('error-state')){
                hideError();
            }
        }
    });
    //End hide error

    var clicktoUp = document.querySelectorAll('.js-list-item');
    for(var i = 0; i < clicktoUp.length; i++){
        clicktoUp[i].onclick = function () {
            $('html').animate({
                scrollTop: 0
            }, 800);
        };
    }
   // first step in registration

    var $container = $(".landing__reg__select");

    $container.on('click', '.js_dsad', function(e) {
        close();
    });
    $container.on('click', function(e) {
        e.stopPropagation();

        if ($(this).hasClass('active')) {
            return;
        }
    });

    $(document).on("click", function (e) {
        var $container = $(".landing__reg__select");

        if ($container.has(e.target).length) {
            return;
        }
        $container.removeClass("open");
        $container.toggleClass("closed");

    });


    for(var i = 2000; i >= 1965; i--) {
        $(".year-birth .landing_selector-option").append(renderSelects(i));
    };

    function renderSelects(i) {
        return '<span class="selector-item" data-year=' + i +' >' + i + '</span>';
    }

    landing.execute();
});