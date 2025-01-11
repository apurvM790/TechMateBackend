const validator = require("validator");

const validateSignUp = (req)=>{

    const { email, password, age } = req.body;

    if(!validator.isEmail(email)){
        throw new Error("Email is not valid: "+email);
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid..!");
    }
    else if(age<15 || age>100){
        throw new Error("Age is not valid: "+age+" ,It must be more than 14 year olds..!");
    }
};

const validateEditProfile = (req) => {

    const validFeilds = [ "firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];

    const { age, gender, about, skills, photoUrl } = req.body;
    
    if(age<15){
        throw new Error("Age is Not Valid..!");
    }

    if(typeof(about) != "undefined" && about.length>500){
        throw new Error("About Range Exceeds..!");
    }
    if(typeof(skills) != "undefined" && skills.length>10 ){
        throw new Error("Skill's Range Exceeds..!");
    }

    if(!validator.isURL(photoUrl)){
        throw new Error("Photo URL is Not Valid..!");
    }

    const isValidFeilds = Object.keys(req.body).every(field => validFeilds.includes(field));
    return isValidFeilds;
}

module.exports = { validateSignUp , validateEditProfile};