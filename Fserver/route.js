
const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const request = require("request");
const email = require('emailjs/email');
const nodemailer = require("nodemailer");


setInterval(function () {


    let query = datab.query("SELECT Voda, Temperatura, IdPolj,Naziv,Id FROM rasadnik", (err, results) => {
        if (err) throw err;

        for (let i = 0; i < results.length; i++) {
            let temp = results[i].Temperatura;
            let vod = results[i].Voda;

            if (vod == 76 || temp == 12.5) {
                console.log(vod);
                console.log(temp);
                let query4 = datab.query("SELECT Email FROM registracijak WHERE Id=?", [results[i].IdPolj], (err, results4) => {
                    if (err) throw err;
                    let email = results4[0].Email;
                    console.log(results[i].Temperatura);

                    let b = "Rasadniku " + results[i].Naziv + " je potrebno odrzavanje";
                    var mailOptions = {
                        from: 'anbojkovic15@gmail.com',
                        to: email,
                        subject: 'Upozorenje',
                        text: b
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });




            }
            if (vod >= 76) {
                console.log(results[i].Temperatura);
                vod = vod - 1;
            }
            if (results[i].Temperatura >= 12.5) {
                console.log(results[i].Temperatura);
                temp = temp - 0.5;
            }


            let query6 = datab.query("UPDATE rasadnik SET Temperatura=?, Voda=? WHERE Id=? ;", [temp, vod, results[i].Id], (err, results6) => {
                if (err) throw err;
                // console.log(query6);
                console.log(results[i].Temperatura);
                console.log(results[i].Id);


            });
        }





    });

}, 3600000);




setInterval(function () {


    let query = datab.query("SELECT id,kol FROM registracijap", (err, results) => {
        if (err) throw err;


        for (let i = 0; i < results.length; i++) {
            let query8 = datab.query("UPDATE registracijap SET Kol=0 WHERE Id=? ;",
                [results[i].id], (err, results3) => {
                    if (err) throw err;
                });


            console.log(results[i].id);
            let query2 = datab.query("SELECT Counter,MIN(Datum) as D FROM dijagram WHERE IdPreduzeca=?", results[i].id, (err, results2) => {
                if (err) throw err;

                if (JSON.stringify(results2) == `[{"Counter":null,"D":null}]`) {
                    let query10 = datab.query("INSERT INTO dijagram(Glavni,IdPreduzeca) VALUES(?,?)",
                        [1, results[i].id], (err, results10) => {
                            if (err) throw err;



                        });
                }
                else {
                    console.log(results2[0].Counter);
                    console.log(results2[0].D);
                    let a = JSON.stringify(results2[0].D).split('T');
                    let b = a[0].split('"');
                    console.log(b[1]);

                    if (results2[0].Counter < 29) {

                        var tomorrow = new Date();
                        tomorrow.setDate(new Date().getDate() + 1);
                        console.log(tomorrow);

                        let query3 = datab.query("INSERT INTO dijagram(IdPreduzeca,Broj,Datum,Kolicina) VALUES(?,?,?,?) ;", [results[i].id, (results2[0].Counter + 1) % 30, tomorrow, results[i].kol], (err, results3) => {
                            if (err) throw err;
                        });
                        let query4 = datab.query("UPDATE dijagram SET Counter=? , Maximum=? WHERE IdPreduzeca=? AND Glavni=1 ;", [(results2[0].Counter + 1) % 30, (results2[0].Counter + 1) % 30, results[i].id], (err, results4) => {
                            if (err) throw err;
                        });



                    }
                    else {
                        let query5 = datab.query("SELECT Minimum,Maximum FROM dijagram WHERE IdPreduzeca=? AND Glavni=1 ;", [results[i].id], (err, results5) => {
                            if (err) throw err;
                            console.log(results5[0]);
                            var minimum = results5[0].Minimum;
                            var maxi = results5[0].Maximum;
                            let query6 = datab.query("UPDATE dijagram SET Minimum=?, Maximum=? WHERE IdPreduzeca=? AND Glavni=1 ;", [(minimum + 1) % 30, (maxi + 1) % 30, results[i].id], (err, results6) => {
                                if (err) throw err;



                            });
                            let query8 = datab.query("UPDATE dijagram SET Kolicina=? WHERE IdPreduzeca=? AND broj=? ;", [results[i].kol, results[i].id, (maxi + 1) % 30], (err, results8) => {
                                if (err) throw err;



                            });


                        });


                    }
                }




            });

        }


    });


}, 86400000);

const datab = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "andjela",
    database: "bazapia",
});
datab.connect((err) => {
    if (err) throw err;
    console.log("Baza je povezana!");
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anbojkovic15@gmail.com',
        pass: 'andjela123'
    },
    tls: {
        rejectUnauthorized: false
    }
});


router.post("/sendmail", (req, res) => {

    var a;
    let query = datab.query("SELECT Email FROM registracijak WHERE Id=?", [req.body.Adresa], (err, results1) => {
        if (err) throw err;


        a = JSON.stringify(results1).split(/"/);
        console.log(a[3]);
        var adres = JSON.stringify(a[3]);
        console.log(adres);

        let b = req.body.Poruka;
        var mailOptions = {
            from: 'anbojkovic15@gmail.com',
            to: adres,
            subject: 'Upozorenje',
            text: b
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        res.send(results1);
    });





});

router.get("/grafik/:id", (req, res) => {


    let query = datab.query("SELECT * FROM dijagram  WHERE IdPreduzeca=?", [req.params.id], (err, results) => {
        if (err) throw err;


        console.log(results + " REZ");
        res.send(results);




    });








});

router.post('/proveraMesto', (req, res) => {

    let kord1;
    let kord2;


    console.log(req.body.grad1);


    const url3 = `https://api.tomtom.com/search/2/geocode/${req.body.grad1}.json?limit=1&countrySet=RS&key=JibocXjYs43jULLdIucNkzSfsAD0Sr7V`


    request(url3, function (err, response, body) {

        body = JSON.parse(body);


        kord2 = body.summary.totalResults;
        console.log(JSON.stringify(kord2));

        res.send({ 'message': kord2 });


    })



});




router.post('/razdaljina', (req, res) => {

    let kord1;
    let kord2;
    let kord3;
    let kord4;
    var konacno = 0;



    const url3 = `https://api.tomtom.com/search/2/geocode/${req.body.grad1}.json?limit=1&countrySet=RS&key=JibocXjYs43jULLdIucNkzSfsAD0Sr7V`
    const url4 = `https://api.tomtom.com/search/2/geocode/${req.body.grad2}.json?limit=1&countrySet=RS&key=JibocXjYs43jULLdIucNkzSfsAD0Sr7V`

    request(url3, function (err, response, body) {

        body = JSON.parse(body);

        kord1 = body.results[0].position.lat;
        kord2 = body.results[0].position.lon;
        console.log(JSON.stringify(kord1));
        console.log(JSON.stringify(kord2));

        request(url4, function (err, response, body2) {

            body2 = JSON.parse(body2);

            kord3 = body2.results[0].position.lat;
            kord4 = body2.results[0].position.lon;
            console.log(JSON.stringify(kord1));
            console.log(JSON.stringify(kord2));

            const url2 = `https://api.tomtom.com/routing/1/calculateRoute/${kord1},${kord2}:${kord3},${kord4}/json?key=JibocXjYs43jULLdIucNkzSfsAD0Sr7V`
            request(url2, function (err, response, body3) {

                body3 = JSON.parse(body3);

                an = body3.routes;
                konacno = an[0].summary.travelTimeInSeconds;
                console.log(JSON.stringify(konacno));

                res.send({ 'message': konacno });



            })



        })





    })



});

router.post('/token_validate', (req, res) => {

    let token = req.body.recaptcha;
    const secretKey = "6LcLB_EUAAAAAClo0pQ7n7M93yudeE7LMkrTE_px";



    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`

    //note that remoteip is the users ip address and it is optional
    // in node req.connection.remoteAddress gives the users ip address

    if (token === null || token === undefined) {
        res.status(201).send({ success: false, message: "Token is empty or invalid" })
        return console.log("token empty");
    }

    request(url, function (err, response, body) {
        //the body is the data that contains success message
        body = JSON.parse(body);

        //check if the validation failed
        if (body.success !== undefined && !body.success) {
            res.send({ success: false, 'message': "recaptcha failed" });
            return console.log("failed")
        }

        //if passed response success message to client
        res.send({ "success": true, 'message': "recaptcha passed" });

    })

})











router.get("/getRegistracijap", (req, res) => {

    let query = datab.query("SELECT * FROM registracijap", (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});

router.get("/getRegistracijak", (req, res) => {

    let query = datab.query("SELECT * FROM registracijak", (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});

router.get("/dohvatiProizvode/:u/:l/:t", (req, res) => {

    let a = req.params.t;
    if (a == 1) {
        let query = datab.query("SELECT * FROM magacin m JOIN proizvod p WHERE m.IdRas=? AND m.IdProizvoda=p.Id ;", [req.params.u], (err, results) => {
            if (err) throw err;
            res.send(results);

        });
    }
    else {
        let query2 = datab.query("SELECT * FROM magacin m JOIN proizvod p WHERE m.IdRas=? AND m.IdProizvoda=p.Id AND p.Id=? AND m.Pristiglo='y' ;", [req.params.u, req.params.l], (err, results2) => {
            if (err) throw err;

            res.send(results2);

        });

    }
});
router.get("/dohvatiProizvodePred/:u", (req, res) => {

    let query = datab.query("SELECT p.* FROM  proizvod p JOIN registracijap r WHERE p.IdProizvodjaca=r.Id AND r.KorIme=?  ;", [req.params.u], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.get("/dohvatiProdavnicu", (req, res) => {

    let query = datab.query("SELECT * FROM  proizvod ;", (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.get("/dohvatiKurire/:Id", (req, res) => {

    let query = datab.query("SELECT K1,K2,K3,K4,K5,Id FROM registracijap WHERE KorIme=? ;", [req.params.Id], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});




router.get("/azurPred/:u", (req, res) => {

    let query = datab.query("UPDATE registracijap SET Prihvacen='y' WHERE KorIme=? ;", [req.params.u], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.get("/azurPoljo/:u", (req, res) => {

    let query = datab.query("UPDATE registracijak SET Prihvacen='y' WHERE KorIme=? ;", [req.params.u], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});

router.get("/pretraziPoPr/:u", (req, res) => {


    let query = datab.query("SELECT * FROM registracijak WHERE KorIme=? ;", [req.params.u], (err, results1) => {
        if (err) throw err;
        let query2 = datab.query("SELECT * FROM registracijap WHERE KorIme=? ;", [req.params.u], (err, results2) => {
            if (err) throw err;



            if (JSON.stringify(results1) != "[]") { res.send(results1); console.log(results1); }
            else if (JSON.stringify(results2) != "[]") { res.send(results2); }
            else { res.send(results1); }
            res.end();


        });

    });



});

router.get("/dohvatiPoljoprivrednika/:IdRas", (req, res) => {


    let query = datab.query("SELECT Mesto FROM  rasadnik  WHERE Id=?  ;", [req.params.IdRas], (err, results1) => {
        if (err) throw err;





        res.send(results1);
        res.end();




    });



});

router.get("/dohvatiGrad/:u", (req, res) => {


    let query = datab.query("SELECT MestoRodjenja FROM registracijak WHERE KorIme=? ;", [req.params.u], (err, results1) => {
        if (err) throw err;
        let query2 = datab.query("SELECT Mesto FROM registracijap WHERE KorIme=? ;", [req.params.u], (err, results2) => {
            if (err) throw err;



            if (JSON.stringify(results1) != "[]") { res.send(results1); console.log(results1); }
            else if (JSON.stringify(results2) != "[]") { res.send(results2); }
            else { res.send(results1); }
            res.end();


        });

    });



});


router.get("/prihvatiNarudzbinu/:u/:kol/:idnar/:idras", (req, res) => {


    let query = datab.query("SELECT KolicinaM FROM magacin  WHERE IdProizvoda=? AND IdRas=? AND Pristiglo='y';", [req.params.u, req.params.idras], (err, results1) => {
        if (err) throw err;


        if (JSON.stringify(results1) != "[]") {
            let test = /{"KolicinaM":\d+}/;
            let test2 = /\d+/;
            let a = JSON.stringify(results1).match(test)[0];
            let b = a.match(test2)[0];
            console.log(Number(b));
            let query2 = datab.query("UPDATE  magacin SET KolicinaM=? WHERE IdProizvoda=? AND IdRas=? AND Pristiglo='y'  ;", [Number(req.params.kol) + Number(b), req.params.u, req.params.idras], (err, results2) => {
                if (err) throw err;
            });
            let query3 = datab.query("DELETE FROM magacin WHERE IdNar=?  ;", [req.params.idnar], (err, results3) => {
                if (err) throw err;
            });
        }
        else {
            let query4 = datab.query("UPDATE  magacin SET Pristiglo='y' WHERE IdNar=?  ;", [req.params.idnar], (err, results4) => {
                if (err) throw err;
            });
            console.log('prihv');
            /*  console.log(query4); */
        }


        res.send(results1);
    });



});

router.get("/dohvatiRasadnik/:u", (req, res) => {

    let query = datab.query("SELECT r.* FROM rasadnik r, registracijak k WHERE k.Id=r.IdPolj AND  k.KorIme=? ;", [req.params.u], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});
router.get("/dohvatiSadnicu/:u", (req, res) => {

    let query = datab.query("SELECT * FROM sadnica WHERE IdRas=? ;", [req.params.u], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.get("/sacekaj/:u/:t/:v", (req, res) => {

    setTimeout(() => {

        let query = datab.query("DELETE FROM sadnica WHERE IdRas=? AND Mesto=?;", [req.params.u, req.params.t], (err, results) => {
            if (err) throw err;
            console.log('obrisao je sadnicu' + req.params.t);
            console.log(query);
            res.send(results);

        });




    }, 86400000);


});
router.post("/sacekajPorudzbinu", (req, res) => {
    let inde = [req.body.ind];
    var vr = [req.body.vreme];
    let rezultat;


    console.log("vreme je " + vr);
    let query10 = datab.query("UPDATE  magacin SET Pristiglo='d' WHERE IdNar=?  ;", [req.body.idnar], (err, results10) => {
        if (err) throw err;
        rezultat = results10;
        res.send(rezultat);


    });
    setTimeout(() => {
        setTimeout(() => {
            console.log('sad se vraca u preduzece');
            console.log(inde);
            JSON.stringify(inde);
            console.log(Number(inde));
            if (Number(inde) == 0) {
                let query5 = datab.query("UPDATE registracijap SET K1=1 WHERE Id=?  ;", [req.body.idr], (err, results5) => {
                    if (err) throw err;


                });
            } else if (Number(inde) == 1) {
                let query5 = datab.query("UPDATE registracijap SET K2=1 WHERE Id=?  ;", [req.body.idr], (err, results6) => {
                    if (err) throw err;


                });

            }
            else if (Number(inde) == 2) {
                let query5 = datab.query("UPDATE registracijap SET K3=1 WHERE Id=?  ;", [req.body.idr], (err, results7) => {
                    if (err) throw err;



                });
            }
            else if (Number(inde) == 3) {
                let query5 = datab.query("UPDATE registracijap SET K4=1 WHERE Id=?  ;", [req.body.idr], (err, results8) => {
                    if (err) throw err;



                });
            }
            else if (Number(inde) == 4) {
                let query5 = datab.query("UPDATE registracijap SET K5=1 WHERE Id=?  ;", [req.body.idr], (err, results9) => {
                    if (err) throw err;



                });
            }
            console.log('SAljem rez');

            console.log("vreme je drugoo" + vr);

        }, vr);


        console.log('usao u funkciju koja ce da dostavi!');


        let query = datab.query("SELECT KolicinaM FROM magacin  WHERE IdProizvoda=? AND IdRas=? AND Pristiglo='y';", [req.body.u, req.body.idras], (err, results1) => {
            if (err) throw err;


            if (JSON.stringify(results1) != "[]") {
                let test = /{"KolicinaM":\d+}/;
                let test2 = /\d+/;
                let a = JSON.stringify(results1).match(test)[0];
                let b = a.match(test2)[0];

                let query2 = datab.query("UPDATE  magacin SET KolicinaM=? WHERE IdProizvoda=? AND IdRas=? AND Pristiglo='y'  ;", [Number(req.body.kol) + Number(b), req.body.u, req.body.idras], (err, results2) => {
                    if (err) throw err;

                });
                let query3 = datab.query("DELETE FROM magacin WHERE IdNar=?  ;", [req.body.idnar], (err, results3) => {
                    if (err) throw err;

                });
            }
            else {
                let query4 = datab.query("UPDATE  magacin SET Pristiglo='y' WHERE IdNar=?  ;", [req.body.idnar], (err, results4) => {
                    if (err) throw err;

                });
                console.log('prihv');

            }




        });




        console.log("vreme je trece " + vr);

    }, vr);



});
router.get("/dohvatiKomentare/:u/:t", (req, res) => {

    if (req.params.t == 1) {
        let query = datab.query("SELECT * FROM komentar  ;", (err, results) => {
            if (err) throw err;

            res.send(results);

        });
    }
    else {
        let query2 = datab.query("SELECT * FROM komentar WHERE IdProizvod=?  ;", [req.params.u], (err, results2) => {
            if (err) throw err;

            res.send(results2);

        });
    }
});

router.get("/dohvatiNarudzbine/:u", (req, res) => {

    let query = datab.query("SELECT n.*,pr.Naziv FROM narudzbine n, registracijap r, proizvod pr WHERE n.IdPreduzeca=r.Id AND r.KorIme=? AND n.IdProizvoda=pr.Id ;", [req.params.u], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});
/*  ///////////////////////////////////////////////////////// */
router.delete("/obrisiPreduzece/:u", (req, res) => {

    let query = datab.query("SELECT Id FROM proizvod WHERE Proizvodjac=?", [req.params.u], (err, results) => {
        if (err) throw err;

        for (let i = 0; i < results.length; i++) {
            let idP = results[i].Id;


            let query6 = datab.query("DELETE FROM magacin WHERE Pristiglo!='y' AND IdProizvoda=? ;", [idP], (err, results6) => {
                if (err) throw err;





            });
        }





    });

    let query4 = datab.query("DELETE FROM narudzbine WHERE idPreduzeca=(SELECT Id FROM registracijap WHERE KorIme=?)", [req.params.u], (err, results3) => {
        if (err) throw err;
        console.log(req.params.u);
        console.log("usao");
        let query1 = datab.query("DELETE FROM proizvod WHERE Proizvodjac=?", [req.params.u], (err, results1) => {
            if (err) throw err;
            console.log(req.params.u);
            console.log("usao");
            let query3 = datab.query("DELETE FROM dijagram WHERE idPreduzeca=(SELECT Id FROM registracijap WHERE KorIme=?)", [req.params.u], (err, results3) => {
                if (err) throw err;

                let query5 = datab.query("DELETE FROM registracijap WHERE KorIme=?;", [req.params.u], (err, results5) => {
                    if (err) throw err;
                    res.send(results5);
                });
            });
        });
    });









});
router.delete("/obrisiPoljoprivrednika/:u", (req, res) => {


    let query2 = datab.query("DELETE FROM narudzbine n WHERE n.IdRas IN (SELECT r.Id from rasadnik r, registracijak k WHERE r.IdPolj=k.Id AND k.KorIme=? );", [req.params.u], (err, results1) => {
        if (err) throw err;
        let query = datab.query("DELETE FROM registracijak WHERE KorIme=?;", [req.params.u], (err, results2) => {
            if (err) throw err;
            res.send(results2);
        });


    });







});
router.delete("/obrisiKor/:u/:t", (req, res) => {

    let a = req.params.t;
    if (a == 'p') {
        let query = datab.query("DELETE FROM registracijap WHERE KorIme=?;", [req.params.u], (err, results1) => {
            if (err) throw err;
            res.send(results1);
        });
    }
    else {
        let query1 = datab.query("DELETE FROM registracijak WHERE KorIme=?;", [req.params.u], (err, results2) => {
            if (err) throw err;
            res.send(results2);
        });
    }



});
router.delete("/obrisiProizvod/:u", (req, res) => {

    console.log(req.params.u);

    let query = datab.query("DELETE FROM proizvod WHERE Id=?;", [req.params.u], (err, results1) => {
        if (err) throw err;

        let query2 = datab.query("DELETE FROM narudzbine WHERE IdProizvoda=?",
            [req.params.u], (err, results2) => {
                if (err) throw err;

                let query3 = datab.query("DELETE FROM magacin WHERE IdProizvoda=? AND Pristiglo!='y' ",
                    [req.params.u], (err, results3) => {
                        if (err) throw err;



                    });



            });
        res.send(results1);
    });

});
router.delete("/obrisiSadnicu/:u/:t", (req, res) => {

    let query = datab.query("DELETE FROM sadnica WHERE IdRas=? AND Mesto=?;", [req.params.u, req.params.t], (err, results) => {
        if (err) throw err;
        console.log('obrisao je sadnicu' + req.params.t);

        res.send(results);

    });
});

router.delete("/odbaciNarudzbinu/:u/:t/:idpr/:idproizvoda/:koli", (req, res) => {
    let t = req.params.t;


    let query1 = datab.query("DELETE FROM narudzbine WHERE IdN=?;", [req.params.u], (err, results1) => {
        if (err) throw err;

        if (t == 'o') {
            let query2 = datab.query("DELETE FROM magacin WHERE IdNar=?;", [req.params.u], (err, results2) => {
                if (err) throw err;
                let query7 = datab.query("SELECT Kolicina FROM proizvod WHERE Id=?;", [req.params.idproizvoda], (err, results7) => {
                    if (err) throw err;
                    let a = results7[0].Kolicina;

                    let query8 = datab.query("UPDATE proizvod SET Kolicina=? WHERE Id=?", [Number(a) + Number(req.params.koli), req.params.idproizvoda], (err, results8) => {
                        if (err) throw err;
                        let a = results7[0].Kolicina;



                    });



                });



            });
        }


        res.send(results1);
    });

});

/*////////////////////////////////////////////////////////////////////////////////////////// */


router.put("/azurirajPreduzeceN", (req, res) => {

    let query = datab.query("UPDATE registracijap SET Lozinka=?,PunoIme=?,Datum=?,Mesto=?,Email=?,Prihvacen=? WHERE KorIme=? ",
        [req.body.Lozinka, req.body.PunoIme, req.body.Datum, req.body.Mesto, req.body.Email, req.body.Prihvacen, req.body.KorIme], (err, results) => {
            if (err) throw err;

            res.send(results);
        });
});
router.put("/azurirajPoljoprivrednikaN", (req, res) => {

    let query = datab.query("UPDATE registracijak SET Lozinka=?,Ime=?,Prezime=?,DatumRodjenja=?,MestoRodjenja=?,Telefon=?,Email=?,Prihvacen=? WHERE KorIme=? ",
        [req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.DatumRodjenja, req.body.MestoRodjenja, req.body.Telefon, req.body.Email, req.body.Prihvacen, req.body.KorIme], (err, results) => {
            if (err) throw err;

            res.send(results);
        });
});
router.put("/azurirajKorisnike", (req, res) => {

    if (req.body.Tip == 'k' || req.body.Tip == 'a') {
        let query = datab.query("UPDATE registracijak SET Lozinka=? WHERE KorIme=? ",
            [req.body.Lozinka, req.body.KorIme], (err, results) => {
                if (err) throw err;

                res.send(results);
            });

    }
    else {
        let query = datab.query("UPDATE registracijap SET Lozinka=? WHERE KorIme=? ",
            [req.body.Lozinka, req.body.KorIme], (err, results) => {
                if (err) throw err;

                res.send(results);
            });

    }

});

router.put("/azurirajRasadnik", (req, res) => {

    let query = datab.query("UPDATE rasadnik SET Temperatura=?, Voda=?, Zasadjeno=? WHERE Id=? ;", [req.body.Temperatura, req.body.Voda, req.body.Zasadjeno, req.body.Id], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.put("/azurirajSadnicu", (req, res) => {

    let query = datab.query("UPDATE sadnica SET Napredak=?, Dostupna=? WHERE IdRas=? AND Mesto=? ;", [req.body.Napredak, req.body.Dostupna, req.body.IdRas, req.body.Mesto], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});
router.put("/azurirajKurire", (req, res) => {

    let query = datab.query("UPDATE registracijap SET K1=?,K2=?, K3=?, K4=?, K5=? WHERE Id=?  ;", [req.body.K1, req.body.K2, req.body.K3, req.body.K4, req.body.K5, req.body.Id], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.put("/azurirajProdavnicu", (req, res) => {

    let query = datab.query("UPDATE proizvod SET Kolicina=? WHERE Id=? ;", [req.body.Kolicina, req.body.Id], (err, results) => {
        if (err) throw err;
        res.send(results);

    });
});
router.put("/azurirajMagacin", (req, res) => {

    let query = datab.query("UPDATE magacin SET KolicinaM=?, Pristiglo=? WHERE IdM=? ;", [req.body.KolicinaM, req.body.Pristiglo, req.body.IdM], (err, results) => {
        if (err) throw err;

        res.send(results);
        res.end();

    });
});
router.put("/azurirajNarudzbine", (req, res) => {

    let query = datab.query("UPDATE narudzbine SET NaCekanju=? WHERE IdN=? ;", [req.body.NaCekanju, req.body.IdN], (err, results) => {
        if (err) throw err;

        res.send(results);

    });
});

/*////////////////////////////////////////////////////////////////////////////////////////// */

router.post("/setRegistracijap", (req, res) => {

    let query = datab.query("INSERT INTO registracijap(PunoIme,KorIme,Lozinka,Datum,Mesto,Email,Prihvacen) VALUES(?,?,?,?,?,?,?)",
        [req.body.PunoIme, req.body.KorIme, req.body.Lozinka, req.body.Datum, req.body.Mesto, req.body.Email, req.body.Prihvacen], (err, results) => {
            if (err) throw err;


            res.send(results);
            res.end();

        });

});
router.get("/setRegistracijapDijagram/:u", (req, res) => {

    let query = datab.query("SELECT id FROM registracijap WHERE KorIme=? ", [req.params.u], (err, results) => {
        if (err) throw err;
        console.log(JSON.stringify(results));
        let query10 = datab.query("INSERT INTO dijagram(Glavni,IdPreduzeca,Counter) VALUES(?,?,30)",
            [1, results[0].id], (err, results10) => {
                if (err) throw err;
                for (let i = 0; i < 30; i++) {
                    var tomorrow = new Date();
                    tomorrow.setDate(new Date().getDate() + 1);


                    let query3 = datab.query("INSERT INTO dijagram(IdPreduzeca,Broj) VALUES(?,?) ;", [results[0].id, i], (err, results3) => {
                        if (err) throw err;
                    });


                } res.send(results10);

            });
    });

});


router.post("/setRegistracijak", (req, res) => {

    let query = datab.query("INSERT INTO registracijak(KorIme,Lozinka,Ime,Prezime,DatumRodjenja,MestoRodjenja,Telefon,Email,Prihvacen) VALUES(?,?,?,?,?,?,?,?,?)",
        [req.body.KorIme, req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.DatumRodjenja, req.body.MestoRodjenja, req.body.Telefon, req.body.Email, req.body.Prihvacen], (err, results) => {
            if (err) throw err;


            res.send(results);
        });
});
router.post("/dodajRasadnik", (req, res) => {
    let query = datab.query("INSERT INTO rasadnik(Naziv,Mesto,Duzina,Sirina,IdPolj,Datum) VALUES(?,?,?,?,?,?) ;",
        [req.body.Naziv, req.body.Mesto, req.body.Duzina, req.body.Sirina, req.body.IdPolj, req.body.Datum], (err, results) => {
            if (err) throw err;
            let a = results.insertId;
            console.log(a);

            res.send(results);

        });
});
router.post("/dodajSadnicu", (req, res) => {


    let query = datab.query("INSERT INTO sadnica(Naziv,IdRas,Presadjivanje,Mesto,Proizvodjac) VALUES(?,?,?,?,?) ;",
        [req.body.Naziv, req.body.IdRas, req.body.Presadjivanje, req.body.Mesto, req.body.Proizvodjac], (err, results) => {
            if (err) throw err;
            let a = results.insertId;

            res.send(results);

        });
});


router.post("/dodajMagacin", (req, res) => {


    let query2 = datab.query("UPDATE registracijap SET Kol= Kol +1 WHERE Id=? ;",
        [req.body.IdPreduzeca], (err, results2) => {
            if (err) throw err;
            let query8 = datab.query("SELECT Minimum FROM dijagram WHERE Glavni=1 AND IdPreduzeca=? ;", [req.body.IdPreduzeca], (err, results8) => {
                if (err) throw err;

                let query7 = datab.query("UPDATE dijagram SET Kolicina=(SELECT Kol FROM registracijap WHERE Id=?) WHERE IdPreduzeca=? AND broj=? AND Glavni=0 ;", [req.body.IdPreduzeca, req.body.IdPreduzeca, results8[0].Minimum], (err, results7) => {
                    if (err) throw err;



                });
            });



        });

    let query4 = datab.query("INSERT INTO narudzbine(IdPreduzeca,IdRas,IdProizvoda,Kolicina,Datum) VALUES(?,?,?,?,?) ;",
        [req.body.IdPreduzeca, req.body.IdRas, req.body.IdProizvoda, req.body.Kolicina, req.body.Datum], (err, results) => {
            if (err) throw err;
            broj = results.insertId;

            let query1 = datab.query("INSERT INTO magacin(IdRas,IdProizvoda,KolicinaM,IdNar) VALUES(?,?,?,?) ;",
                [req.body.IdRas, req.body.IdProizvoda, req.body.Kolicina, broj], (err, results1) => {
                    if (err) throw err;
                    res.send(results1);

                });




        });



});
router.get("/dodajNarud/:kol", (req, res) => {


    let query = datab.query("INSERT INTO narudzbine(IdPreduzeca,IdRas,IdProizvoda,Kolicina) VALUES(?,?,?,?) ;",
        [req.body.IdPreduzeca, req.body.IdRas, req.body.IdProizvoda, req.body.Kolicina], (err, results) => {
            if (err) throw err;
            let a = results.insertId;






        });
    console.log("okej!!");
    res.send(results);
});
router.post("/dodajKomentar", (req, res) => {


    let query = datab.query("INSERT INTO komentar(IdProizvod,IdPoljoprivrednika,Ocena,Sadrzaj,Polj) VALUES(?,?,?,?,?) ;",
        [req.body.IdProizvod, req.body.IdPoljoprivrednika, req.body.Ocena, req.body.Sadrzaj, req.body.Polj], (err, results) => {
            if (err) throw err;
            console.log('OK');

            res.send(results);

        });
});
router.post("/dodajProizvod", (req, res) => {

    let query = datab.query("SELECT PunoIme,Id FROM registracijap WHERE KorIme=?  ;",
        [req.body.Proizvodjac], (err, results) => {
            if (err) throw err;


            if (JSON.stringify(results) != []) {
                let test3 = /"Id":\d+/;
                let test4 = /\d+/;


                let p = JSON.stringify(results).match(test3)[0];
                let l = p.match(test4)[0];
                console.log(Number(l));
                let query2 = datab.query("INSERT INTO proizvod(Naziv,Proizvodjac,Tip,Napredak,Presadjivanje,Ocena,Kolicina,IdProizvodjaca,CenaPro) VALUES(?,?,?,?,?,?,?,?,?) ;",
                    [req.body.Naziv, req.body.Proizvodjac, req.body.Tip, req.body.Napredak, req.body.Presadjivanje, req.body.Ocena, req.body.Kolicina, Number(l), req.body.CenaPro], (err, results2) => {
                        if (err) throw err;
                        let query3 = datab.query(" SELECT Id FROM proizvod WHERE Naziv=? AND Proizvodjac=? ",
                            [req.body.Naziv, req.body.Proizvodjac], (err, results3) => {
                                if (err) throw err;
                                let bro = JSON.stringify(results3[0].Id);
                                console.log('broj proiz je' + bro);
                                res.send(bro);

                            });




                    });



            }
            else { res.send(0); };


        });


});






module.exports = router;



