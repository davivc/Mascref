'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])  
  .service('Dashboard', function Dashboard(Rest, Researchers) {
    var service = {      
      'stats': function () {
        return Rest.request({
          'method': "GET",
          'url': "/stats/app/"
        });
      },
      'researchers': function () {
        return Researchers.list();
      },
    }

    return service;
  })  
  // .service('Projects', function Projects(Rest) {
  //   var service = {
  //     'url': "/projects/",
  //     'list': function (parent) {
  //       var query = [];
  //       var qStr = '';
  //       if (parent) query.push('parent=' + parent);

  //       if (query.length > 1) qStr = '?' + query.join('&');
  //       else if (query.length == 1) qStr = '?' + query[0];
  //       return Rest.get(this.url + qStr);
  //     },
  //     'get': function (pk) {
  //       return Rest.request({
  //         'method': "GET",
  //         'url': "/projects/" + pk + "/"
  //       });
  //     },
  //     'create': function (pData) {
  //       var data = {
  //         'name': pData.name,
  //         'description': pData.description,
  //         'parent': pData.parent,
  //         'public': pData.restricted,
  //         'owner': pData.owner.id
  //       }
  //       return Rest.request({
  //         'method': "POST",
  //         'url': "/projects/",
  //         'data': data
  //       });
  //     },
  //     'delete': function (url, data) {
  //       return this.request({
  //         'method': "PATCH",
  //         'url': url,
  //         'data': data
  //       })
  //     }
  //   }

  //   return service;
  // })
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
  .service('Activity', function Activity(Rest) {
    var service = {      
      'url': "/activity/",
      'list': function () {
        return Rest.get(this.url);
      },
    }

    return service;
  });
  