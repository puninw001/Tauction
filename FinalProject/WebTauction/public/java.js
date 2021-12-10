window.onload = function(){
    initUser();
    update();
	countorder();
	countpro();
	setUsa();
	firebase.auth().onAuthStateChanged(function (user){
		if (user) {
			readProfile(user.uid);
		}
	})
	update2();
}

let testor;
let testorpro;
let count = 0;
let count2 = 0;
let dataOrder;
let keyOrder;
let dataOrder2;
let keyOrder2;
let dataUser;
let keyUser;
let rate = "";
let usernamed = "";
let sendrateto = "";
let late;

function countorder(){
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		dataOrder = data;
		keyOrder = key;
		for (let i in key){
			count += 1;
		}
		count += 1;
	});
}

function countpro(){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		dataOrder2 = data;
		keyOrder2 = key;
		for (let i in key){
			count2 += 1;
		}
		count2 += 1;
	});
}

var ref = firebase.database().ref("test");
ref.on('value', (snapshot) =>{
    const data = snapshot.val();
    // console.log(data);
    // console.log(Object.keys(data));
    }
);

function setUsa(){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		dataUser = data;
		keyUser = key;
	});
}

function register(){
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	if(email.lenght < 6 || password.lenght < 6){
		alert("Email และ Password ต้องมากกว่า 6 ตัวอักษร");
		return;
	}
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
	    var errorCode = error.code;
	    var errorMessage = error.message;

	    if (errorCode == 'auth/email-already-in-use') {
	        alert("Email นี้ถูกใช้งานแล้ว");
	    }else{
	        alert(errorMessage);
	    }
  	}).then(function (check){
  		if(check){
  			document.getElementById("email").value = "";
	  		document.getElementById("password").value = "";
	  	  	alert("Register Complete");
	  	  	window.location.href = "index.html";
	  	}
  	});
}

function sign(){
	if(firebase.auth().currentUser){
		firebase.auth().signOut();
		console.log("Bye");
	}
	else{
		var email = document.getElementById("email").value;
		var password = document.getElementById("password").value;
		if(email.lenght < 6 || password.lenght < 6){
			alert("Email และ Password ต้องมากกว่า 6 ตัวอักษร");
			return;
		}
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		    var errorCode = error.code;
		    var errorMessage = error.message;

		    if (errorCode == 'auth/wrong-password') {
		        alert("Password ไม่ถูกต้อง");
		    }else{
		        alert(errorMessage);
		    }
	  	}).then(function(check){
	  		if(check){
	  			window.location.href = "index.html"; 
	  		}
	  	})
	}
}

function initUser(){
	firebase.auth().onAuthStateChanged(function (user) {
		//User Log in
		if (user) {
			usernamed = user;
			console.log(window.location.href);
			document.getElementById("sign").textContent = "Sign Out";
			document.getElementById("nosign").style.display = "none";
			document.getElementById("insign").style.display = "block";
			let x = document.querySelectorAll("#headeruser");
			for (var i in x) {
				x[i].innerHTML = user.email;
			}
			document.getElementById("hidsign").innerHTML = '<a onclick="sign()">Log out</a>';
		}
		else{
			document.getElementById("sign").textContent = "Sign in";
			document.getElementById("nosign").style.display = "block";
			document.getElementById("insign").style.display = "none";
			let x = document.querySelectorAll("#headeruser");
			for (var i in x) {
				x[i].innerHTML = "";
			}
			document.getElementById("hidsign").innerHTML = '<a href="register.html">Register</a><a href="login.html">Log in</a>';
		}
	});
}

function readHistory(){
	let chk;
	let chkDate;
	let chkBy;
	let chkHis = 1;
	let his = "";
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		for(let i in keyOrder){
    			chk = keyOrder[i];
    			if(user.email == dataOrder[chk].fixBy || user.email == dataOrder[chk].email){
    				if(dataOrder[chk].doneDate == "")
    					chkDate = "Order isn't progressed.";
    				else
    					chkDate = dataOrder[chk].doneDate;
    				his += `<div class="row" style="text-align:center;cursor: pointer;" onclick='openpost(${dataOrder[chk].noor})'>
								<div class="col-2">
									<p>${dataOrder[chk].type}</p>
								</div>
								<div class="col-2">
									<p>${dataOrder[chk].province}</p>
								</div>
								<div class="col-2">
									<p>${dataOrder[chk].date_create}</p>
								</div>
								<div class="col-3">
									<p>${dataOrder[chk].status}</p>
								</div>
								<div class="col-3">
									<p>${dataOrder[chk].email}</p>
								</div>
							</div><hr>`;
						chkHis = 0;
    			}
    		}
    		if (chkHis) {his = `<h1 style="text-align:center;">No order progress.</h1>`;}
    		document.getElementById("hisor").innerHTML = his;
    	}
    	else{
    		document.getElementById("hisor").innerHTML = `<h1 style="text-align:center;">Please Sign in</h1>`;
    	}
    });
}

function resetpass(){
	var email = document.getElementById("email").value;
	firebase.auth().sendPasswordResetEmail(email).then(function(){
		alert("Password Reset Email sent!");
	}).catch(function(error){
		var errorCode = error.code;
		var errorMessage = error.message;

	    if (errorCode == 'auth/invalid-email') {
	        alert(errorMessage);
	    }else if(errorCode == 'auth/user-not-found'){
	        alert(errorMessage);
	    }
	});
}

function update(){
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
        let troub = "";
		for (let i in key) {
			chk = key[i];
            if (data[chk].isHave){
                troub += `<div class="row" style="border: 1px black solid;cursor: pointer;" onclick='openpost(${data[chk].noor})'>
                <div class="col-2">
                    <p>${data[chk].type}</p>
                </div>
                <div class="col-3">
                    <p>${data[chk].province}</p>
                </div>
                <div class="col-4">
                    <p>${data[chk].topic}</p>
                </div>
                <div class="col-3">
                    <p>${data[chk].email}</p>
                </div>
            </div>`;
            }
		}
        document.getElementById("troub").innerHTML = troub;
	});
}

function update2(){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
        let tech = "";
		let rass;
		for (let i in key) {
			chk = key[i];
            if (data[chk].อุปกรณ์ != ""){
				rass = data[chk].rating1/data[chk].rating2;
				rass = rass.toFixed(2);
				late = rass;
                tech += `<div class="row" style="border: 1px black solid;cursor: pointer;" onclick='openpro(${data[chk].noor})'>
                <div class="col-2">
                    <p>${data[chk].Surname}</p>
                </div>
                <div class="col-2">
                    <p>${data[chk].Lastname}</p>
                </div>
                <div class="col-3">
                    <p>${data[chk].จังหวัด}</p>
                </div>
                <div class="col-2">
                    <p>${late}</p>
                </div>
				<div class="col-3">
                    <p>${data[chk].email}</p>
                </div>
            </div>`;
            }
		}
        document.getElementById("techs").innerHTML = tech;
	});
}

var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();

document.getElementById("select").onclick = function(e){

	var input = document.createElement('input');
	input.type = 'file';
	
	input.onchange = e => {
		files = e.target.files;
		reader = new FileReader();
		reader.onload = function(){
			document.getElementById("myimg").src = reader.result;
		}
		reader.readAsDataURL(files[0]);
	}
	input.click();
}

let isup = 0;

setInterval(function() {
	if(isup == 1) {
		alert("Create Post Success!");
		isup = 0;
		window.location.href = "index.html";
	} else if (isup == 2) {
		alert("Edit Profile Complete!");
		isup = 0;
		window.location.href = "profile.html"
	} else if (isup == 3) {
		alert("upgrade profile success!");
		isup = 0;
		window.location.href = "profile.html"
	}
	update();
	update2();
	readHistory();
}, 5000);

document.getElementById('upload').onclick = function (){
	var type = document.getElementById("type").value;
    var province = document.getElementById("province").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var topic = document.getElementById("topic").value;
    var detail = document.getElementById("detail").value;
    if((type == "") || (province == "") || (address == "")){
    	alert("Type, Province and Address must be fill");
    	return;
    }
    let chk;
    let current = new Date();
    let date = current.toLocaleString();
    firebase.auth().onAuthStateChanged(function (user){
    	if(user){
			ImgName = document.getElementById('type').value;
			var uploadTask = firebase.storage().ref('Images/'+ImgName+count+".png").put(files[0]);

			uploadTask.on('state_changed', function(snapshot){
				var progress = (snapshot.bytesTranferred / snapshot.totalBytes) * 100;
				document.getElementById('upProgress').innerHTML = 'Upload'+progress+'%';
			})
			const firebaseRef = firebase.database().ref("test");
			uploadTask.snapshot.ref.getDownloadURL().then(function(url){
				ImgUrl = url;
				isup = 1;
				firebaseRef.push({
					type: type,
					province: province,
					phone: phone,
					address: address,
					topic: topic,
					detail: detail,
					uid: user.uid,
					email: user.email,
					noor: count,
					date_create: date,
					isHave: true,
					fixBy: "none",
					doneDate: "",
					status: "Technician Finding",
					ImgLink: ImgUrl,
					technician: [0],
					});
			});
		}
        else {
            alert("Please Sign in");
            window.location.href = "login.html";
        }
    });
}

function openpost(num){
	var ref = firebase.database().ref("test");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		let inn = "";
		for (let i in key){
			chk = key[i];
			if(data[chk].noor == num){
				testor = chk;
				inn += `<div class="container">
							<div class="row" style="background-color: #2089CF;">
								<div class="col-12 col-lg-10" style="text-align: center;color: white; margin-bottom: 20px;padding-top: 10px;">
									<h2 style="text-align:left; padding-bottom:20px; padding-left:60px;">${data[chk].topic}</h2></a>
								</div>
								<div class="col-12 col-lg-2" style="padding-top:10px;">
									<button onclick="clorder()"><img src="img/close.png" style="height:70px; width:90px;"></button>
								</div>
							</div>
						</div>
						<div class="container">
							<div class="row">
								<div class="col-12 col-lg-6">
									<div class="row">
										<p>Province : ${data[chk].province} | User : ${data[chk].email} </p>
									</div>
									<div class="row">
										<a href="${data[chk].ImgLink}"><img class="orderimg" src="${data[chk].ImgLink}"/></a>
									</div>
									<div class="row">
										<div class="col-12" style="border: 1px black solid;">
											<p>Type: ${data[chk].type}</p>
											<p>Address: ${data[chk].address}</p>
											<p>Phone: ${data[chk].phone}</p>
											<p>Detail: ${data[chk].detail}</p>
										</div>
									</div>
								</div>
								<div class="col-12 col-lg-1">
								</div>
								<div class="col-12 col-lg-5">
									<div class="row">
										<div class="col-12" style="border: 1px black solid; margin-top:10px;">
											<h3> Status: ${data[chk].status}</h1>
											<p style="text-align:center;">(${data[chk].fixBy})</p>
										</div>
									</div>
									<div class="row">`
									if (data[chk].status == "Technician Finding"){
										inn += `<div class="col-12" style="border: 1px black solid; margin-top:10px;">
										<h3>Technicians Offer</h3>`
										if(data[chk].email == usernamed.email){
											for (i in data[chk].technician){
												if(i != 0){
													inn += `<p>${data[chk].technician[i]}</p><button onclick="accept(${i})">Accept</button>`
												}
											}
										}else{
											for (i in data[chk].technician){
												if(i != 0){
													inn += `<p>${data[chk].technician[i]}</p>`
												}
											}
										}
										inn += `</div>`
									}
									else if (data[chk].status == "Trouble Fixed" && data[chk].email == usernamed.email && data[chk].isHave){
										sendrateto = data[chk].fixBy;
										inn +=`<div class="col-12" style="border: 1px black solid; margin-top:10px;">
										<div class="row">
										<p style="margin-left:10px;">rating:  <select id="rates" style="margin-top:10px; width: 200px;">
											<option value="5">5</option>
											<option value="4">4</option>
											<option value="3">3</option>
											<option value="2">2</option>
											<option value="1">1</option>
										</select></p>
										<button style="margin-top:10px; margin-bottom:10px; margin-left:10px;"  onclick="givrate()"> Rates </button>
										</div></div>`
									}
							
									inn +=		`
									</div>
								</div>
							</div>
						</div>
						<div>`
						if(data[chk].email != usernamed.email && data[chk].status == "Technician Finding"){
							inn +=	`<button class="btn btn-primary mid" onclick="offer()" style="margin-top:30px;margin-bottom:30px;">Send Offer</button>`;
						}
						if(data[chk].email == usernamed.email && data[chk].status != "Deleted" && data[chk].isHave){
							inn += `<button class="btn btn-primary mid" onclick="deleteorder()" style="margin-top:30px;margin-bottom:30px; background-color:red;">Delete Order!</button>`;
						}
						if(data[chk].fixBy == usernamed.email && data[chk].status == "On Working"){
							inn += `<button class="btn btn-primary mid" onclick="doneorder()" style="margin-top:30px;margin-bottom:30px; ">Done!</button>`;
						}
						inn += `</div>`
			}
		}
		document.getElementById("hidorder").innerHTML = inn;
		document.getElementById("hidorder").style.opacity = "1";
		document.getElementById("hidorder").style.zIndex = "100";
		document.getElementById("hidback").style.opacity = "0.7";
		document.getElementById("hidback").style.zIndex = "99";
	});
}

function clorder(){
	document.getElementById("hidorder").style.opacity = "0";
	document.getElementById("hidorder").style.zIndex = "-10";
	document.getElementById("hidback").style.opacity = "0";
	document.getElementById("hidback").style.zIndex = "-11";
	document.getElementById("hidsure").style.display = "none";
}

function readProfile(idd){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		let profileimg ='';
		let profileicon ="";
		let add = "";
		let con = "";
		let abt = "";
		for(let i in key){
			chk = key[i];
			if(data[chk].uid == idd){
				testorpro = key[i];
				if (data[chk].rating1 == 0 && data[chk].rating2 == 0){
					rate = "no rating";
				} else {
					rate = data[chk].rating1/data[chk].rating2;
					rate = rate.toFixed(2);
				}
				profileicon += `<div style="margin-right:15px;">
							<a href="profile.html"><img src="${data[chk].proimg}" class="avatar"></a>
							</div>`;
				profileimg += `<div class="mid">
							<img src="${data[chk].proimg}" class="mid profile">
						</div>`;
				add += `<div class="mid">
							<img src="img/address.png" class="logo1">
							<p>${data[chk].address}</p>
						</div>`;
				con += `<div class="mid">
							<img src="img/call.png" class="logo1">
							<p>${data[chk].phone}</p>
						</div><div class="mid">
							<img src="img/fb.png" class="logo1">
							<p>${data[chk].fb}</p>
						</div><div class="mid">
							<img src="img/line.png" class="logo1">
							<p>${data[chk].line}</p>
						</div><div class="mid">
							<img src="img/email.png" class="logo1">
							<p>${data[chk].email}</p>
						</div>`;
				document.getElementById("ipf").innerHTML = profileimg;
				document.getElementById("add").innerHTML = add;
				document.getElementById("con").innerHTML = con;
				document.getElementById("proicon").innerHTML = profileicon;
			}
			if(data[chk].อุปกรณ์ != "" && data[chk].uid == idd){
				abt += `<div>
							<p>ชื่อ :${data[chk].Surname} นามสกุล :${data[chk].Lastname}</p>
						</div>
						<div>
							<p>อุปกรณ์ที่เชี่ยวชาญ :${data[chk].อุปกรณ์}</p>
						</div>
						<div>
							<p>จังหวัดที่รับงาน : ${data[chk].จังหวัด}</p>
						</div>
						<div>
							<p>เกี่ยวกับตัวฉัน : ${data[chk].introduce}</p>
						</div>
						<div>
							<p>Rating : ${rate}</p>
						</div>`;
				document.getElementById("abtme").innerHTML = abt;
			}
		}
	});
}

document.getElementById('editpro').onclick = function (){
	var phone = document.getElementById("phone").value;
	var fb = document.getElementById("fb").value;
	var line = document.getElementById("line").value;
	var proimg;
	var address = document.getElementById("address").value;
	let chk;
	let newbie = 1;
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		const firebaseRef = firebase.database().ref("userinfo");
    		for(i in keyUser){
    			chk = keyUser[i];
    			if(user.email == dataUser[chk].email){
    				newbie = 0;
    				break;
    			}
			}
			if(newbie){
				var uploadTask = firebase.storage().ref('Profile/'+user.email+".png").put(files[0]);

				uploadTask.on('state_changed', function(snapshot){
					var progress = (snapshot.bytesTranferred / snapshot.totalBytes) * 100;
					document.getElementById('upProgress').innerHTML = 'Upload'+progress+'%';
				})

				uploadTask.snapshot.ref.getDownloadURL().then(function(url){
					ImgUrl = url;
					isup = 2;
					firebaseRef.push({
						phone: phone,
						fb: fb,
						line: line,
						proimg: ImgUrl,
						address: address,
						uid: user.uid,
						email: user.email,
						อุปกรณ์: "",
						จังหวัด: "",
						introduce: "",
						Surname: "",
						Lastname: "",
						noor: count2,
						rating1: 0,
						rating2: 0,
					});
				});
			}
			else{
				var uploadTask = firebase.storage().ref('Profile/'+user.email+".png").put(files[0]);

				uploadTask.on('state_changed', function(snapshot){
					var progress = (snapshot.bytesTranferred / snapshot.totalBytes) * 100;
					document.getElementById('upProgress').innerHTML = 'Upload'+progress+'%';
				})
				uploadTask.snapshot.ref.getDownloadURL().then(function(url){
					ImgUrl = url;
					isup = 2;
					firebaseRef.child(`${chk}/phone`).set(phone);
					firebaseRef.child(`${chk}/fb`).set(fb);
					firebaseRef.child(`${chk}/line`).set(line);
					firebaseRef.child(`${chk}/proimg`).set(ImgUrl);
					firebaseRef.child(`${chk}/address`).set(address);
				});
			}
		}
		else{
			alert("Please Sign in");
			window.location.href = "login.html";
		}
    });
}

function upgrade(){
	let newbie = 1;
	let chk;
	firebase.auth().onAuthStateChanged(function (user){
    	if(user){
    		const firebaseRef = firebase.database().ref("userinfo");
    		for(i in keyUser){
    			chk = keyUser[i];
    			if(user.email == dataUser[chk].email){
    				newbie = 0;
    				break;
    			}
			}
		}
		if(newbie){
			alert ("กรุณา edit profile ของคุณ");
		}
		else {
			window.location.href = "uppro.html";
		}
	});
}

function uppro(){
	var surname = document.getElementById("sname").value;
	var lastname = document.getElementById("lname").value;
	var type1 = document.getElementById("type1").value;
	var type2 = document.getElementById("type2").value;
	var type3 = document.getElementById("type3").value;
	var province = document.getElementById("province1").value;
	var introduce = document.getElementById("introduce").value;
	let chk;
	firebase.auth().onAuthStateChanged(function (user){
		for(i in keyUser){
			chk = keyUser[i];
			if(user.email == dataUser[chk].email){
				break;
			}
		}
		const firebaseRef = firebase.database().ref("userinfo");
		firebaseRef.child(`${chk}/Surname`).set(surname);
		firebaseRef.child(`${chk}/Lastname`).set(lastname);
		firebaseRef.child(`${chk}/อุปกรณ์`).set(type1+", "+type2+", "+type3);
		firebaseRef.child(`${chk}/จังหวัด`).set(province);
		firebaseRef.child(`${chk}/introduce`).set(introduce);
		isup = 3;
	});
}

function openpro(num){
	var ref = firebase.database().ref("userinfo");
	ref.on('value', (snapshot) =>{
		const data = snapshot.val();
		let key = Object.keys(data);
		let chk;
		let inn = "";
		for (let i in key){
			chk = key[i];
			if(data[chk].noor == num){
				inn += `<div class="container">
							<div class="row" style="background-color: #2089CF;">
								<div class="col-12 col-lg-10" style="text-align: center;color: white; margin-bottom: 20px;padding-top: 10px;">
									<h2 style="text-align:left; padding-bottom:20px; padding-left:60px;">Technician Profile</h2></a>
								</div>
								<div class="col-12 col-lg-2" style="padding-top:10px;">
									<button onclick="clorder()"><img src="img/close.png" style="height:70px; width:90px;"></button>
								</div>
							</div>
						</div>
						<div class="mid" style="padding-top:10px; padding-bottom:10px;">
							<img src="${data[chk].proimg}" class="mid profile">
						</div>
						<div> <h4 style="text-align: center;">${data[chk].Surname} ${data[chk].Lastname}</h4>
						<h4 style="text-align: center;">rating : ${late}</h4></div>
						<div class="container">
							<div class="row">
								<div class="col-lg-5 col-12" style="text-align: center;border: 1px black solid;">
								<h3 style="background-color: #2089CF;color: white;padding-top: 20px;padding-bottom: 30px;border: 1px black solid;">About Me</h3>
								<div>
									<p>อุปกรณ์ที่เชี่ยวชาญ :${data[chk].อุปกรณ์}</p>
								</div>
								<div>
									<p>จังหวัดที่รับงาน : ${data[chk].จังหวัด}</p>
								</div>
								<div>
									<p>เกี่ยวกับตัวฉัน : ${data[chk].introduce}</p>
								</div>
							</div>
							<div class="col-lg-4 col-12" style="text-align: center;border: 1px black solid;">
								<h3 style="background-color: #2089CF;color: white;padding-top: 20px;padding-bottom: 30px;border: 1px black solid;">Address</h3>
								<div class="mid">
									<img src="img/address.png" class="logo1">
									<p>${data[chk].address}</p>
								</div>
							</div>
							<div class="col-lg-3 col-12" style="text-align: center;border: 1px black solid;">
								<h3 style="background-color: #2089CF;color: white;padding-top: 20px;padding-bottom: 30px;border: 1px black solid;">Contact</h3>
								<div class="mid">
									<img src="img/call.png" class="logo1">
									<p>${data[chk].phone}</p>
								</div><div class="mid">
									<img src="img/fb.png" class="logo1">
									<p>${data[chk].fb}</p>
								</div><div class="mid">
									<img src="img/line.png" class="logo1">
									<p>${data[chk].line}</p>
								</div><div class="mid">
									<img src="img/email.png" class="logo1">
									<p>${data[chk].email}</p>
								</div>
							</div>
							</div>
						</div>`;
			}
		}
		document.getElementById("hidorder").innerHTML = inn;
		document.getElementById("hidorder").style.opacity = "1";
		document.getElementById("hidorder").style.zIndex = "100";
		document.getElementById("hidback").style.opacity = "0.7";
		document.getElementById("hidback").style.zIndex = "99";
	});
}

function offer(){
	const firebaseRef = firebase.database().ref("test");
	var poro = dataOrder[testor].technician;
	var checkdd = 1;
	var newbie = 1;
	for (i in poro){
		if (poro[i] == usernamed.email){
			checkdd = 0;
			break;
		}
	}
	for(i in keyUser){
		chk = keyUser[i];
		if(usernamed.email == dataUser[chk].email){
			newbie = 0;
			break;
		}
	}
	if (newbie){
		alert("Only Technician can offer !");
	}else{
		if(dataUser[chk].อุปกรณ์ != ""){
			if (checkdd){
				poro.push(usernamed.email);
				firebaseRef.child(`${testor}/technician`).set(poro);
				alert("Sending offer Successful!");
			}else {
				alert("You already sending Offer!");
			}
		}else{
			alert("Only Technician can offer !");
		}
	}
}

function accept(namenum){
	const firebaseRef = firebase.database().ref("test");
	var accwho = dataOrder[testor].technician[namenum];
	firebaseRef.child(`${testor}/fixBy`).set(accwho);
	firebaseRef.child(`${testor}/status`).set("On Working");
	firebaseRef.child(`${testor}/technician`).set([0]);
}

function deleteorder(){
	let confirmAction = confirm("Are you sure to Delete the post?");
        if (confirmAction) {
			const firebaseRef = firebase.database().ref("test");
			firebaseRef.child(`${testor}/status`).set("Deleted");
			firebaseRef.child(`${testor}/isHave`).set(false);
        }
}

function doneorder(){
	let confirmAction = confirm("Finished your work?");
        if (confirmAction) {
			const firebaseRef = firebase.database().ref("test");
			firebaseRef.child(`${testor}/status`).set("Trouble Fixed");
        }
}

function givrate(){
	let confirmAction = confirm("Rating Technician?");
        if (confirmAction) {
			const firebaseRef = firebase.database().ref("userinfo");
			var rade = document.getElementById("rates").value;
			for(let i in keyOrder2){
				let chk = keyOrder2[i];
				if (sendrateto == dataOrder2[chk].email){
					let aoun1 = parseInt(dataOrder2[chk].rating1) + parseInt(rade);
					let aoun2 = parseInt(dataOrder2[chk].rating2) + 1;
					firebaseRef.child(`${chk}/rating1`).set(aoun1);
					firebaseRef.child(`${chk}/rating2`).set(aoun2);
				}
			}
			const firebaseRe = firebase.database().ref("test");
			firebaseRe.child(`${testor}/isHave`).set(false);
			window.location.href = "index.html";
		}
}