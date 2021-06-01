var UserProfile = (function() {
    var user_name = "";
  
    var getName = function() {
      return user_name;    // Or pull this from cookie/localStorage
    };
  
    var setName = function(name) {
      user_name = name;     
      // Also set this in cookie/localStorage
    };
  
    return {
      getName: getName,
      setName: setName
    }
  
  })();
  
  export default UserProfile;