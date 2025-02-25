
const device_services = require('../services/device_services');

module.exports = {
    
     add_devices : async(req, res) => {
          try{
             const devices = await device_services.add_device_service(req);
             res.status(200).send({success  : true , devices : devices});
          }
          catch(e){
              console.log(e);
              res.status(500).send({error_message : e.message});
          }
     },

     link_devices : async(req, res) => {
           try{
              const linked_devices = await device_services.link_device_service(req);
              res.status(200).send({success  : true , linked_devices : linked_devices});
           }
           catch(e){
              console.log(e);
              res.status(500).send({error_message : e.message});
           }
     }
    
}
