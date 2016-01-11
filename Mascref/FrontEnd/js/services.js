'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])  
  .service('Dashboard', function Dashboard(Rest, Researchers) {
    var service = {      
      'stats': function () {
        return Rest.request({
          'method': "GET",
          'url': "/dashboard/stats/"
        });
      },
      'researchers': function () {
        return Researchers.list();
      },
    }

    return service;
  })  
  .service('Projects', function Projects(Rest) {
    var service = {      
      'list': function (parent) {
        var search = '?';
        if(parent) search = search  + 'parent=' + parent
        return Rest.request({
          'method': "GET",
          'url': "/projects/" + search
        });
      },
      'get': function (pk) {
        return Rest.request({
          'method': "GET",
          'url': "/projects/" + pk + "/"
        });
      },
      'create': function (pData) {
        var data = {
          'name': pData.name,
          'description': pData.description,
          'parent': pData.parent,
          'public': pData.restricted,
          'owner': pData.owner.id
        }
        return Rest.request({
          'method': "POST",
          'url': "/projects/",
          'data': data
        });
      }
    }

    return service;
  })
  .service('Surveys', function Surveys(Rest) {
    var service = {
      'list': function (project) {
        var search = '?';
        if (project) search = search + 'project=' + project
        return Rest.request({
          'method': "GET",
          'url': "/surveys/" + search
        });
      },
      'get': function (pk) {
        return Rest.request({
          'method': "GET",
          'url': "/surveys/" + pk + "/"
        });
      },
      'create': function (pData) {
        var data = {
          'name': pData.name,
          'project': pData.project,
          'date_start': pData.date_start,
          'date_end': pData.date_end,
          'public': pData.restricted,
          'owner': pData.owner.id
        }
        return Rest.request({
          'method': "POST",
          'url': "/surveys/",
          'data': data
        });
      }
    }

    return service;
  })
  .service('Researchers', function Projects(Rest) {
    var service = {
      'list': function (search) {
        var qStr = '?';
        if (search) qStr = qStr + 'search=' + search
        return Rest.request({
          'method': "GET",
          'url': "/researchers/" + qStr
        });
      },
      'get': function (pk) {
        return Rest.request({
          'method': "GET",
          'url': "/researchers/" + pk + "/"
        });
      }
    }

    return service;
  })  
  .service('Transect', function Transect(Rest) {
    var service = {
      'url': "/transects/",
      'list': function (search) {
        var qStr = '?';
        if (search) qStr = qStr + 'search=' + search
        return Rest.get(this.url + qStr);
      },
      'get': function (pk) {
        return Rest.get(this.url + pk + "/");
      },
      'save': function (pData) {
        var data = {
          'name': pData.name,
          'survey': pData.survey,
          'site': pData.site.id,
          'date': pData.date,
          'time_start': pData.time_start,          
          //'team_leader': pData.team_leader.id ? pData.team_leader.id : '',
          'depth': pData.depth
        }
        if (pData.id) return Rest.patch(this.url + pData.id + "/", data);
        else return Rest.post(this.url, data);
      }
    }

    return service;
  });