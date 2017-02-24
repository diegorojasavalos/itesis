'use strict'
const auth = require("../auth/auth");
const itesis = require("../model/itesis");
const config = require("../config/config.json");
const dblink = config.link;
const mongojs = require("mongojs");
var db = mongojs(dblink, ['itesis']);

function login(req, res) {
    let user = req.body;
    db.itesis.aggregate({
            $unwind: '$usuarios'
        }, {
            $match: {
                'usuarios.cod': user.cod,
                'usuarios.pwd': user.pwd
            }
        }, {
            $unwind: '$alumnos'
        }, {
            $match: {
                'alumnos.cod': user.cod
            }
        }, {
            $group: {
                _id: '$_id',
                user: {
                    $push: {
                        cod: '$usuarios.cod',
                        pwd: '$usuarios.pwd',
                        type: '$usuarios.type',
                        name: "$alumnos.name",
                        lastname: "$alumnos.lastname",
                        docente: "$alumnos.docente"
                    }
                }
            }
        },
        function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                if (docs.length > 0) {
                    let fullname = docs[0].user[0].name + " " + docs[0].user[0].lastname;
                    res.send({
                        cod: 1,
                        msg: "Usuario autorizado",
                        type: docs[0].user[0].type,
                        fullname: fullname,
                        docente: docs[0].user[0].docente
                    });
                } else {
                    res.send({
                        cod: 2,
                        msg: "Credenciales no válidas"
                    });
                }
            }
        });
}

function getTesis(req, res) {
    db.itesis.find({}, {
            tesis: 1,
            _id: 0
        },
        function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.send(docs[0]);
            }
        });
}

function getInfoUser(req, res) {
    let user = req.body;
    db.itesis.aggregate({
            $unwind: '$alumnos'
        }, {
            $match: {
                'alumnos.cod': user.cod
            }
        }, {
            $group: {
                _id: '$_id',
                user: {
                    $push: {
                        name: '$alumnos.name',
                        lastname: '$alumnos.lastname',
                        fac: '$alumnos.fac'
                    }
                }
            }
        },
        function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                if (docs.length > 0) {
                    res.send({
                        cod: 1,
                        user: docs[0].user[0]
                    });
                } else {
                    res.send({
                        cod: 2,
                        msg: "Usuario no valido"
                    });
                }
            }
        });
}

function changePassword(req, res) {
    let pwd = req.body.pwd;
    let cod = req.body.cod;
    let npwd = req.body.npwd;

    db.itesis.update({
        "usuarios.cod": cod,
        "usuarios.pwd": pwd
    }, {
        $set: {
            "usuarios.$.pwd": npwd
        }
    }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            if (result.nModified === 1) {
                res.send({
                    cod: 1,
                    msg: "Actualizado con exito"
                });
            } else {
                res.send({
                    cod: 2,
                    msg: "Datos incorrectos"
                });
            }

        }
    });

}

function addTesis(req, res) {
    let tes = req.body;
    tes.status = 2;
    db.itesis.update({
        _id: mongojs.ObjectId('588b8369734d1d20b6680265')
    }, {
        $push: {
            tesis: tes
        }
    }, function (err, result) {
        if (err) {
            res.send({
                cod: 0,
                msg: "Error agregar tesis"
            });
        } else {
            res.send({
                cod: 1,
                msg: "Tesis agregada con éxito"
            });
        }
    });
}

function getAsesores(req, res) {
    db.itesis.find({}, {
            docentes: 1,
            _id: 0
        },
        function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                res.send(docs[0]);
            }
        });
}

function addAsesor(req, res) {
    let cod = req.body.codalum;
    let status = req.body.status;
    let asesor = req.body.asesor;
    let name = req.body.name;


    db.itesis.update({
        "tesis.alumno": cod
    }, {
        $set: {
            "tesis.$.status": status
        }
    }, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            if (result.nModified === 1) {
                db.itesis.update({
                    "alumnos.cod": cod
                }, {
                    $set: {
                        "alumnos.$.docente.asesor": {
                            name: asesor,
                            cod: name
                        }
                    }
                }, function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (result.nModified === 1) {
                            res.send({
                                cod: 1,
                                msg: "Actualizado con exito"
                            });
                        } else {
                            res.send({
                                cod: 2,
                                msg: "Datos incorrectos 2"
                            });
                        }

                    }
                });
            } else {
                res.send({
                    cod: 2,
                    msg: "Datos incorrectos 1"
                });
            }

        }
    });
}

function indexRequest(req, res) {
    res.status(200).send({
        cod: 1,
        msg: "Correcto"
    });
}

function test(req, res) {
    db.itesis.aggregate({
            $unwind: '$usuarios'
        }, {
            $match: {
                'usuarios.cod': "20122284",
                'usuarios.pwd': "contraseña"
            }
        }, {
            $unwind: '$alumnos'
        }, {
            $match: {
                'alumnos.cod': "20122284"
            }
        }, {
            $group: {
                _id: '$_id',
                user: {
                    $push: {
                        cod: '$usuarios.cod',
                        pwd: '$usuarios.pwd',
                        type: '$usuarios.type',
                        name: "$alumnos.name",
                        lastname: "$alumnos.lastname"
                    }
                }
            }
        },
        function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                if (docs.length > 0) {
                    let fullname = docs[0].user[0].name + " " + docs[0].user[0].lastname;
                    res.send({
                        cod: 1,
                        msg: "Usuario autorizado",
                        type: docs[0].user[0].type,
                        fullname: fullname
                    });
                } else {
                    res.send({
                        cod: 2,
                        msg: "Credenciales no válidas"
                    });
                }
            }
        });
}



module.exports = {
    login,
    getTesis,
    getInfoUser,
    changePassword,
    addTesis,
    getAsesores,
    addAsesor,
    indexRequest,
    test
}