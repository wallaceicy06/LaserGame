/**
* Light.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
    locX: {type: 'integer',
           required: true},
    locY: {type: 'integer',
           required: true},
    dirX: {type: 'integer',
           required: true},
    dirY: {type: 'integer',
           required: true}
  }
};

