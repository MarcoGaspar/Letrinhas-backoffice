window.TestsCloneView = Backbone.View.extend({
    events: {
        'click .previewTest': "fillPreview",
        "click #deletebtn": "deleteTest",
        //"click #desenhamarco": "encheQuestions",
        "click .addQuestion": "addQuestion",
        "click .removeQuestion": "removeQuestion",
        "click .removeQuestionOld": "removeQuestionOld",
        'click [type="checkbox"]': "filterBy",
        'click .contentFilter': "filterBycontent",
        "keyup #txtSearch": "filterBy",
        "click #orderBy": "orderQuestions",
        "blur .emptyField": "isEmpty",
        "click #newtestbtn": "beforeSend",
        "click #buttonCancelar": "goBack",


    },

    orderQuestions: function(e) {
        var mylist = $('#allQuestions');

        orderContentList(mylist, e);
    },
    goBack: function (e) {
        e.preventDefault();
        window.history.back();
    },
    //Verifies if an input is empty
    isEmpty: function(e) {
        if ($(e.currentTarget).val().length != 0) {
            $(e.currentTarget).removeClass("emptyField");
        }
    },


    //Applys filters
    filterBy: function() {
        //Esconde todos os testes
        var typedText = $("#txtSearch").val();

        //Esconde todos os testes
        $("#allQuestions  .panel-default").hide();
        //Mostra apenas os que contém a string escrita
        $("#allQuestions  .panel-default:containsi(" + typedText + ")").show();

        //Esconde os testes cujas checkboxes não estão seleccionadas
        $.each($("input:checkbox:not(:checked)"), function(i, k) {
            $("#allQuestions  .panel-default[type=" + $(k).attr("value") + "]").hide();
        });

        //Esconde os que ao correspondem conteudos seleccionados
        $.each($("#allQuestions  .panel-default:visible"), function(i, k) {
            //Se nao pertencerem à categoria escolhida, esconde-os
            if ($(k).attr("value").indexOf($("#filterSubject").attr("filter")) == -1) {
                $(k).hide();
            }
        });

        $("#questionsBadge").text($("#allQuestions  .panel-default:visible").length + "/" + $("#allQuestions .panel").length)
    },

    //Applys filters
    filterBycontent: function(e) {
        var self = this;
        $("#filterSubject").attr("filter", $(e.target).attr("value"));
        self.filterBy();
    },

    //remover nova questao ao teste
    removeQuestion: function(e) {

        //Move o elemento
        $("#" + $(e.currentTarget).attr("questID"))
            .appendTo("#allQuestions");
        //Altera o icon
        $(e.currentTarget).html("+").removeClass("removeQuestion btn-Rmv").addClass(
                "btn-Add addQuestion"
            )
            //Remove a dd da importancia
        $(e.currentTarget).parent().find("select").remove()
            //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .panel").length)
        $("#questionsBadge").text($("#allQuestions .panel:visible").length + "/" + $("#allQuestions .panel").length)

    },

    //remover antiga pergunta ao teste
    removeQuestionOld: function(e) {
        //Move o elemento
        $("#" + $(e.currentTarget).attr("questID")).remove();
        $("#questionsTestBadgeOld").text($("#questionsListOld .panel").length)
    },

    //adicionar nova questao ao teste
    addQuestion: function(e) {

        $("#" + $(e.currentTarget).attr("questID"))
            .appendTo("#questionsList");
        //Altera o botao
        $(e.currentTarget).html("-").removeClass("btn-Add addQuestion").addClass(
            "btn-Rmv removeQuestion"
        );
        //Adiciona a dd de importancia da question
        $(e.currentTarget).parent().append(getImportanceDD())



        //Incrementa o nr de perguntas
        $("#questionsTestBadge").text($("#questionsList .panel").length);
        $("#questionsBadge").text($("#allQuestions .panel:visible").length + "/" + $("#allQuestions .panel").length)

    },

    //fazer preview ao teste
    fillPreview: function(id) {

        var testID = id;

        var self = this;
        //Recolhe a info do teste
        var test = this.data;

        //Recolhe a info de cada uma das perguntas do teste
        $("#mvCrsl" + testID + " .carousel-indicators").empty();
        $("#mvCrsl" + testID + " .carousel-inner").empty();
        $.each(test.questions, function(testKey, quest) {

            //Adiciona o botao
            $("#mvCrsl" + testID + " .carousel-indicators").append($('<li>', {
                'data-target': "#mvCrsl" + testID,
                'data-slide-to': testKey
            }));


            var question = new Question({
                id: quest._id
            });

            question.fetch(function() {
                //Adiciona o titulo
                //Adiciona a div onde será apresentado o conteúdo
                $("#mvCrsl" + testID + " .carousel-inner").append($('<div>', {
                    class: 'item',
                    html: quest.title,
                    id: 'questionsPreview' + (testKey + '').concat(testID)
                }));
                //Exibe os dados do teste
                self.enchePreview(question.attributes, (testKey + '').concat(testID));
                //Exibe a primeira pergunta do teste
                $("#mvCrsl" + testID + ' .carousel-indicators li:first').addClass('active');
                $("#mvCrsl" + testID + ' .carousel-inner > div:first').addClass('active');
            })

        });



    },

    //Text Preview
    enchePreview: function(question, i) {
        //gets model info
        var self = this;
        //Clear Preview
        $("#questionsPreview" + i).empty();

        //Question Description
        $("#questionsPreview" + i)
            .append(
                $('<label>', {
                    class: "dataTitle col-md-12 row",
                    text: question.title
                }).append("<hr>"),
                $('<div>', {
                    class: "form-group"
                }),
                $('<div>', {
                    class: "form-group"
                }).append(
                    $('<label>', {
                        class: "col-md-3 lblDataDetails",
                        text: "Pergunta:"
                    }),
                    $('<label>', {
                        class: "col-md-9 ",
                        text: question.question
                    })
                ),

                $('<div>', {
                    class: "col-md-12",
                    id: "questionBox" + i
                })
            );

        switch (question.type) {
            case 'text':
                $("#questionsPreview" + i).append(getTextPreview(question))
                break;
            case 'list':
                $("#questionsPreview" + i).append(setListPreview(question))
                break;
            case 'interpretation':
                $("#questionsPreview" + i).append(setInterpretationPreview(question))
                break;
            case 'multimedia':
                $("#questionsPreview" + i).append(setMultimediaPreview(question))
                break;
            case 'boxes':
                $("#questionsPreview" + i).append(setBoxesPreview(question))
                break;
            case 'whitespaces':
                $("#questionsPreview" + i).append(setWhiteSpacesPreview(question))
                break;
        };
    },

    //prenche as perguntas que já existem no teste na lista
    fillOld: function() {
        //Recolhe a info do teste
        var test = this.data;
        //Recolhe a info de cada uma das perguntas do teste

        $.each(test.questions, function(testKey, quest) {
            var question = new Question({
                id: quest._id
            });

            question.fetch(function() {
              console.log(question._id)
                var questToDraw = question.attributes;

                  var b = ' <div class="panel panel-default" value="' + questToDraw.subject + '" id="' + questToDraw._id + '" type="' + questToDraw.type + '" style="margin-top:-15px;">' +
                      '<div class="panel-heading '+ question.attributes._id+'" value="' + questToDraw.subject + ' >' +
                      '<h4 class="panel-title">' +
                      '<img src="img/' + questToDraw.type + '.png" class="smallImgPreView" style="padding-left:0px">' +
                      '<img src="img/' + questToDraw.subject.split(':')[0] + '.png" class="smallImgPreView"  style="padding-left:10px">' +
                      '<span style="padding-left:15px">' + questToDraw.title + ' </span> '+
                      '<a data-toggle="collapse" data-parent="#allQuestions" href="#P ' + i + '"></a>' +
                      '<button type="button" class="btn-Rmv  removeQuestionOld" questID="' + questToDraw._id + '">'+
                      '<i class="fa fa-times" aria-hidden="true"></i>'+
                      ' remover </button>' +
                      ' </h4>' +
                      '</div>' +
                      '<div id="P ' + i + '" class="panel-collapse collapse ">' +
                      ' <div class="panel-body">' +
                      '<label class="col-md-3 lblDataDetails">Pergunta:</label>' +
                      '<label class="col-md-9 " >' + questToDraw.question + '</label>' +
                      '<%getImportanceDD()%>'+
                      '<% if ( ' + questToDraw.type + ' == "text"){ %>' +
                      '<%print(getTextPreview(' + quest + ')) %>' +
                      '<% } %>' +
                      '<% if ( ' + questToDraw.type + ' == "list"){ %>' +
                      '<%print(setListPreview(' + quest + ')) %>' +
                      '<% } %>' +

                      '<% if ( ' + questToDraw.type + ' == "multimedia"){ %>' +
                      '<%print(setMultimediaPreview(' + quest + ')) %>' +
                      '<% } %>' +

                      '<% if ( ' + questToDraw.type + ' == "interpretation"){ %>' +
                      '<%print(setInterpretationPreview(' + quest + ')) %>' +
                      '<% } %>' +

                      '<% if ( ' + questToDraw.type + ' == "boxes"){ %>' +
                      '<%print(setBoxesPreview(' + quest + ')) %>' +
                      '<% } %>' +

                      '<% if ( ' + questToDraw.type + ' == "whitespaces"){ %>' +
                      '<%print(setWhiteSpacesPreview(' + quest + ')) %>' +
                      '<% } %>' +
                      '</div>' +
                      '</div>' +
                      '</div>';

                      $("#questionsListOld").append(b);
                      $('.'+question.attributes._id).append(getImportanceDD());
            })

        });
    },

    //menu lateral
    setSideMenu: function() {
        var self = this;
        var cats = new Categories();
        cats.fetch(function() {
            var categories = cats.toJSON();
            for (var i = 0; i < categories.length; i++) {
                var $contents = $('<ul>', {
                    class: "treeview-menu",
                    style: "display: none;"
                });
                $contents.append(
                    $('<li>').append(
                        $('<a>', {
                            href: "#",
                            class: "contentFilter",
                            value: categories[i]._id
                        }).append(
                            $('<i>', {
                                class: "fa fa-circle-o text-aqua"
                            }),
                            'All'
                        )
                    )
                )
                for (var sub = 0; sub < categories[i].content.length; sub++) {

                    var $spec = $('<ul>', {
                        class: "treeview-menu",
                        style: "display: none;"
                    });
                    $spec.append(
                        $('<li>').append(
                            $('<a>', {
                                href: "#",
                                class: "contentFilter",
                                value: categories[i].content[sub]._id
                            }).append(
                                $('<i>', {
                                    class: "fa fa-circle-o text-aqua"
                                }),
                                'All'
                            )
                        )
                    )
                    for (var spec = 0; spec < categories[i].content[sub].specification.length; spec++) {

                        $('.sidebar-menu', self.el).append(
                            $spec.append(
                                $('<li>').append(
                                    $('<a>', {
                                        href: "#",
                                        class: "contentFilter",
                                        value: categories[i].content[sub].specification[spec]._id
                                    }).append(
                                        $('<i>', {
                                            class: "fa fa-circle-o text-aqua"
                                        }),
                                        categories[i].content[sub].specification[spec].name
                                    )
                                )
                            )
                        )
                    }
                    $('.sidebar-menu', self.el).append(
                        $contents.append(
                            $('<li>').append(
                                $('<a>', {
                                    href: "#"
                                }).append(
                                    $('<i>', {
                                        class: "fa fa-circle-o text-orange"
                                    }), categories[i].content[sub].name, $('<span>', {
                                        class: 'pull-right-container'
                                    }).append(
                                        $('<i>', {
                                            class: "fa fa-angle-left pull-right"
                                        })
                                    )
                                ),
                                $spec
                            )
                        )
                    )
                }
                $('.sidebar-menu', self.el).append(
                    $('<li>', {
                        class: "treeview"
                    }).append(
                        $('<a>', {
                            href: '#'
                        }).append(
                            $('<img>', {
                                src: " img/" + categories[i]._id + ".png"
                            }),
                            $('<span>', {
                                html: categories[i].subject
                            }),
                            $('<span>', {
                                class: 'pull-right-container'
                            }).append(
                                $('<i>', {
                                    class: "fa fa-angle-left pull-right"
                                })
                            )
                        ),

                        $contents
                    )
                )
            }
        })
    },

    //enche a lista de perguntas a inserir
    encheQuestions: function() {
        var self = this;
        var questions = new Questions();

        questions.fetch(function() {
            var q = questions.toJSON();

            $("#questionsBadge").text(q.length);

            for (var i = 0; i < q.length; i++) {
                var quest = q[i];
                  var toHtml = ' <div class="panel panel-default" value="' + quest.subject + '" id="' + quest._id + '" type="' + quest.type + '">' +
                    '<div class="panel-heading" value="' + quest.subject + ' >' +
                    '<h4 class="panel-title">' +
                    '<a data-toggle="collapse" data-parent="#allQuestions" href="#P' + i + '"></a>' +
                    '<img src="img/' + quest.type + '.png" class="smallImgPreView" style="padding-left:10px">' +
                    '<img src="img/' + quest.subject.split(':')[0] + '.png" class="smallImgPreView" style="padding-left:10px">' +
                    '<span style="padding-left:15px"> ' + quest.title + '</span>' +
                    '<button type="button" class="btn-Add addQuestion" questID="' + quest._id + '"> + </button>' +
                    ' </h4>' +
                    '</div>' +
                    '<div id="P ' + i + '" class="panel-collapse collapse">' +
                    ' <div class="panel-body">' +
                    '<label class="col-md-3 lblDataDetails">Pergunta:</label>' +
                    '<label class="col-md-9 ">' + quest.question + '</label>' +
                    '<% if ( ' + quest.type + ' == "text"){ %>' +
                    '<%print(getTextPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '<% if ( ' + quest.type + ' == "list"){ %>' +
                    '<%print(setListPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '<% if ( ' + quest.type + ' == "multimedia"){ %>' +
                    '<%print(setMultimediaPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '<% if ( ' + quest.type + ' == "interpretation"){ %>' +
                    '<%print(setInterpretationPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '<% if ( ' + quest.type + ' == "boxes"){ %>' +
                    '<%print(setBoxesPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '<% if ( ' + quest.type + ' == "whitespaces"){ %>' +
                    '<%print(setWhiteSpacesPreview(' + quest + ')) %>' +
                    '<% } %>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $("#allQuestions", this.el).append(toHtml);
            }
        })
    },


    //Before Sending Request To Server
    beforeSend: function (e) {
        e.preventDefault();

        //Se algum dos campos estiver vazio
        var allListElements = $(".mandatory");
        //Verifies if all inputs are OK
        var isValid = isFormValid(allListElements);

        //Recolhe os paineis das peguntas
        var questions = $("#newTestForm .panel");



        //Se o teste nao possuir nenhuma pergunta
        if (questions.length == 0) {
            isValid = false;
            alertMsg($("body"), "O teste deverá conter no mínimo uma pergunta.")
        }
        //If they are
        if (isValid) {
            $('#content').append(loadingSpinner());
            //Recolhe os dados da view
            var testDetails = $('#newTestForm').serializeObject();
            //Cria um novo model

            var test = new Test(testDetails);
            test.attributes.questions = [];

            //test.attributes.schoolYear=this.data.schoolYear;
            //test.attributes.subject=this.data.subject;

            //Adiciona os seus id's e a sua dificuldade ao array de perguntas
            $.each(questions, function (iQ, question) {
                test.attributes.questions.push({
                    _id: $(question).attr("id"),
                    dif: $("#" + $(question).attr("id") + " select").val()
                });
                //Converte o ano escolar para inteiro
                test.attributes.schoolYear = parseInt(test.attributes.schoolYear);
            })


            test.save(null, {
                success: function (user) {
                    sucssesMsg($(".form"), "Teste inserido com sucesso!");
                    setTimeout(function () {
                        app.navigate("tests", {
                            trigger: true
                        });
                    }, 2000);
                },
                error: function (model, response) {
                    failMsg($(".form"), "Lamentamos mas não foi possível inserir o teste! \n" + JSON.parse(response.responseText).result);
                }
            });


        }

    },







    //Class Initializer
    initialize: function(id) {


        this.data = this.model.toJSON();

        this.id = this.data._id;
        this.bd2 = 'aprender_tests';
        this.site = 'http://letrinhas.ipt.pt:85';



    },

    afterRender: function () {
        var self = this;
        //seleecciona o ano escolar
        $("#selectAno").val(self.data.schoolYear)

    },
    //Class Renderer
    render: function() {
        var self = this;

        self.setSideMenu();
        self.encheQuestions();
        self.fillOld();

        getCategories(self.data.subject);

        getFilters();

        getTypes();
        self.fillPreview(this.id);

        $(this.el).html(this.template({
            model: self.data,
            questions: self.quests
        }));
        //$('.translations', this.el).i18n();

        return this;
    }

});
