var nodemailer=require("nodemailer"),
EmailTemplate=require('email-templates').EmailTemplate;

var smtpTransport=nodemailer.createTransport({//"SMTP",
	
	service:"Gmail",
	auth:{user:"famiactuar@gmail.com",pass:"famiactuar698"}
	//auth:{user:"cntctns890706698@actuartolima.com",pass:"890706698"}
	
});



function send(options,body,callback){
	var contacto=new EmailTemplate(options.html);
	contacto.render(body,function(err,results){
		if(err) return callback(err,results);
		//delete options.html
		options.html=results.html;
		options.text=results.text;
		//console.log(results);
		smtpTransport.sendMail(options,function(err,respuesta){
			if(err){
				console.log("error sendmail:",err);
				//send({from:"pagina web <talestales777@gmail.com>",subject:"error",to:"admin <jhoneao@gmail.com>",html:"<h1>error "+err+"</h1>"},function(err2,respuesta2){});
			}
			else console.log("Message sent:"+JSON.stringify(respuesta));
			callback(err,respuesta);
		});
	});
	
}

exports.send=send;