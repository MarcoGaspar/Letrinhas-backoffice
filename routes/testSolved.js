require('colors');
var config = require('../config.js');
//DB Info
var nano = require('nano')(config.dbserver);
var dbResolutions = nano.use(config.db_resolutions);
var dbStudents = nano.use(config.db_students);
var dbTests = nano.use(config.db_tests);
var dbQuestions = nano.use(config.db_questions);
var jsonQuery = require('json-query');



/*
exports.delete = function(req, res) {
    var id = req.params.id;


    //Obtem os dados do teste

    dbTests.get(id, function(err, resolution) {
        if (err) {
            return res.status(err.statusCode).json({});
        }


       var alunoid = resolution.studentID;



        dbStudents.get(resolution.studentID, function(err, student) {
            if (err) {
                return res.status(err.statusCode).json({});
            }

            resolution.student = student;

            //Obtem os dados das questions do teste

            var testes = [];
            dbTests.list({
                'include_docs': true, 'attachments': true,
                'limit': undefined, 'descending': false
            }, function (err, body) {
                if (err) {
                    return res.status(500).json({
                        'result': 'nok',
                        'message': err
                    });
                }
                for (var i = 0; i < body.rows.length; i++) {
                  var testee = body.rows[i].doc;
                  if (testee.studentID == alunoid) {
                      console.log(testee);







                      dbResolutions.list({
                          'include_docs': true,
                          'limit': undefined,
                          'descending': true
                      }, function(err, resolutions) {
                          if (err) {
                          }

                          //Obtem as resolucoes das perguntas
                          var testResolutions = jsonQuery('rows[doc][*testID=' + testee._id + ']', {
                              data: resolutions
                          }).value;

                          console.log(testResolutions);
                              for (var i = 0; i < testResolutions.length; i++) {
                                  var toDel = testResolutions[i];
                                  dbResolutions.destroy(toDel._id, toDel._rev, function(err) {

                                      if (err) {
                                          //Report Error (Student Doenst Exists)
                                          console.log("Error Removing resolutions");
                                          return res.status(err.statusCode).json({});
                                      } else {
                                          console.log('test resolutions deleted');
                                      }
                                  });

                              }

                              });

























                      dbTests.destroy(testee._id, testee._rev, function(err) {

                          if (err) {
                              //Report Error (Student Doenst Exists)
                              console.log("Error Removing resolutions");
                              return res.status(err.statusCode).json({});
                          } else {
                              console.log('test resolutions deleted');
                          }
                      });

                  }

                }
                //console.log(body.rows)

                //res.json(jsonQuery('[doc][*generic=true]', {data: body.rows}).value);
            });












        });

        res.send(200, {
            result: "Teste eliminado com sucesso."
        });


    });


};

*/

exports.delete = function(req, res) {
    var id = req.params.id;


    dbTests.get(id, function(err, resolution) {
        if (err) {
          return res.send(500, {result: "Todos os campos sao de preenchimento obrigatório"});
        }

        console.log('teste id:  '+ resolution._id);
        console.log('teste rev:  '+ resolution._rev);

        dbStudents.get(resolution.studentID, function(err, student) {
            if (err) {
                return res.status(err.statusCode).json({});
            }

            resolution.student = student;

            dbResolutions.list({
                'include_docs': true,
                'limit': undefined,
                'descending': true
            }, function(err, resolutions) {
                if (err) {
                  console.log('err');
                    dbTests.destroy(resolution._id, resolution._rev, function(err) {
                        if (err) {
                            console.log("Error Removing solved test");
                        }
                    });
                }

                //Obtem as resolucoes das perguntas
                var testResolutions = jsonQuery('rows[doc][*testID=' + req.params.id + ']', {
                    data: resolutions
                }).value;

                console.log('tamanho:' + testResolutions.length);

                    for (var i = 0; i < testResolutions.length; i++) {
                        var toDel = testResolutions[i];
                        console.log('apagar:' + toDel._id);
                        dbResolutions.destroy(toDel._id, toDel._rev, function(err) {

                            if (err) {
                                //Report Error (Student Doenst Exists)
                                console.log("Error Removing resolutions");
                                return res.status(err.statusCode).json({});
                            } else {
                                console.log('test resolutions deleted');
                            }
                        });

                    }
/*
                    console.log(resolution._rev);

                    var rev = resolution._rev.charAt(0);
                    console.log('tamanho:  ' +rev);

                    for (var i = rev; i > 0; i--) {
                      console.log(i);
                      console.log('ita');


                      var newRev = i+''+resolution._rev.replace((resolution._rev)[0],'');
                      console.log(newRev);

                      dbTests.destroy(resolution._id, i+''+resolution._rev.replace((resolution._rev)[0],''), function(err) {


                          if (err) {
                              //Report Error (Student Doenst Exists)
                              console.log("Error Removing solved test");

                          }

                            console.log('test  : ' +  i+''+resolution._rev.replace((resolution._rev)[0],'') +'  deleted.');

                      });


                    }
*/


                    dbTests.destroy(resolution._id, resolution._rev, function(err) {


                        if (err) {
                            //Report Error (Student Doenst Exists)
                            console.log("Error Removing solved test");

                        }

                          console.log('test  : ' + resolution._id +'  deleted.');

                    });


            });
        });




    });


};
