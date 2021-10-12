window.onload = function(){
    initUser();
    update();
	countorder();
}

let count = 0;
let dataOrder;
let keyOrder;
let dataUser;
let keyUser;
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

var ref = firebase.database().ref("test");
ref.on('value', (snapshot) =>{
    const data = snapshot.val();
    console.log(data);
    console.log(Object.keys(data));
    }
);

console.log("test")

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
	})
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

// function creOrder(){
// 	var type = document.getElementById("type").value;
//     var province = document.getElementById("province").value;
//     var phone = document.getElementById("phone").value;
//     var address = document.getElementById("address").value;
//     var topic = document.getElementById("topic").value;
//     var detail = document.getElementById("detail").value;
//     if((type == "") || (province == "") || (address == "")){
//     	alert("Type, Province and Address must be fill");
//     	return;
//     }
//     let chk;
//     let ised = 0;
//     let current = new Date();
//     let date = current.toLocaleString();
//     firebase.auth().onAuthStateChanged(function (user){
//     	if(user){
//             const firebaseRef = firebase.database().ref("test");
// 		    firebaseRef.push({
// 				type: type,
// 		        province: province,
// 		        phone: phone,
// 			    address: address,
// 		        topic: topic,
// 		        detail: detail,
// 		        uid: user.uid,
// 			    email: user.email,
// 		        noor: count,
//                 date_create: date,
// 		        isHave: true,
// 			    fixBy: "",
// 			    doneDate: "",
// 		        status: "Technician Finding",
// 		    });
// 			    alert("Create Post Success!");
// 			    window.location.href = "index.html";
// 		}
//         else {
//             alert("Please Sign in");
//             window.location.href = "login.html";
//         }
//     });
// }

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
	}
}, 10000);

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
					ImgLink: ImgUrl
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
											<img class="center" style="text-align:center;" src="">
											<p style="text-align:center;">(${data[chk].fixBy})</p>
										</div>
									</div>`
				inn += `</div>
							</div>
						</div>
						<button class="btn btn-primary mid" onclick="showSure(${data[chk].noor})" style="margin-top:30px;margin-bottom:30px;">DEAL!</button>`;
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
