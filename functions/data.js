const {timeToString, birthday, daysToBday} = require("./moment");
const fs = require('fs')
const moment = require('moment');
moment.locale('pt-br');

function createFile(datafile){
  fs.writeFileSync(("./"+datafile), ("{}"));
}

function loadData(datafile){
  if (!fs.existsSync("./"+(datafile))){
    console.log("Criando arquivo!");
    createFile(datafile)
  }
  return JSON.parse(fs.readFileSync("./"+(datafile), 'utf8'));
}

function saveData(datafile, data){
  fs.writeFileSync("./"+(datafile), JSON.stringify(data, null, 2));
  console.log("Saved!")
}

function updateMemberData(member, data, datafile, botrelease, fusotime){

      function restoreMemberData(name){
        dataf = loadData(datafile)
        if(name in dataf.memberList[member.user.id]){
          return (dataf.memberList[member.user.id])[name];
        }else{
          return null;
        }
      }

      if(!(member.user.id in data.memberList)) {
        data.memberList[member.user.id] = {};
        saveData(datafile, data);
        console.log("b");
      }

      if(restoreMemberData("authorized") == true && restoreMemberData("authorizedTimeUnix") !== null){
        if(data.memberList[member.user.id].veteranTimeUnix !== restoreMemberData("authorizedTimeUnix")+veterantime){
          data.memberList[member.user.id].veteranTimeUnix = restoreMemberData("authorizedTimeUnix")+veterantime;
          console.log("Updating authorizedTimeUnix (data)");
          saveData(datafile, data);
        }
      }
      
      if(restoreMemberData("veteranTimeUnix") == null){
        var veteranDate = null
      } else{
        var veteranDate = moment(restoreMemberData("veteranTimeUnix")+fusotime).format('DD/MM/YYYY')
      }

      if(restoreMemberData("veteranTimeUnix") == null){
        var veteranString = null
      } else {
        var veteranString = timeToString(restoreMemberData("veteranTimeUnix"), fusotime)
      }

      var veteran = restoreMemberData("veteranTimeUnix") <= Date.now();

      if((member.joinedTimestamp) << botrelease){
        if(restoreMemberData("authorized") !== true || restoreMemberData("legacyMember") !== true) {
          data.memberList[member.user.id].authorized = true;
          data.memberList[member.user.id].authorizedById = "141957307591426050";
          data.memberList[member.user.id].authorizedByName = "JPSAUD501";
          data.memberList[member.user.id].legacyMember = true
          console.log("Legacy member detected (data)");
          saveData(datafile, data);
        }
      }

      var memberdata = {
         "id": member.user.id,
         "user": member.user.username,
         "noob": member._roles.includes("896257202426376192"),
         "bot": member.user.bot,
         "birthday": birthday(member.joinedTimestamp, fusotime),
         "daysToBday": daysToBday(member.joinedTimestamp, fusotime),
         "joinTimeUnix": member.joinedTimestamp,
         "joinDate": moment(member.joinedTimestamp+fusotime).format('DD/MM/YYYY'),
         "joinString": timeToString(member.joinedTimestamp, fusotime),
         "veteranTimeUnix": restoreMemberData("veteranTimeUnix"),
         "veteranDate": veteranDate,
         "veteranString": veteranString,
         "veteran": veteran,
         "authorized": restoreMemberData("authorized"),
         "authorizedTimeUnix": restoreMemberData("authorizedTimeUnix"),
         "authorizedById": restoreMemberData("authorizedById"),
         "authorizedByName": restoreMemberData("authorizedByName"),
         "legacyMember": restoreMemberData("legacyMember"),
         "msg": restoreMemberData("msg")
      } 

    if (JSON.stringify(memberdata) !== JSON.stringify(data.memberList[member.user.id])) {
      data.memberList[member.user.id] = memberdata;
      console.log("Updating member data (data)");
      saveData(datafile, data);
    }
  }

module.exports = {
    createFile: createFile,
    loadData: loadData,
    saveData: saveData,
    updateMemberData: updateMemberData
};