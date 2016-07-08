'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
  .service('ACL', function ACL(Rest) {
    var service = {
      'url': "/groups_acl/",
      'list': function () {
        return Rest.get(this.url);
      },
    }

    return service;
  })
  .service('Country', function Country(Rest) {
    var service = {
      'url': "/countries/",
      'list': function (search) {
        var qStr = '?';
        if (search) qStr = qStr + 'search=' + search
        return Rest.get(this.url + qStr);
      },
      'get': function (pk) {
        return Rest.get(this.url + pk + "/");
      }
    }

    return service;
  })
  .service('Province', function Province(Rest) {
    var service = {
      'url': "/provinces/",
      'list': function (search, country) {
        var qStr = '?';
        if (search) qStr = qStr + 'search=' + search;
        if (country) qStr = qStr + '&country=' + country;
        return Rest.get(this.url + qStr);
      },
      'get': function (pk) {
        return Rest.get(this.url + pk + "/");
      },
      'save': function (pData) {
        var data = {
          'name': pData.name,
          'country': pData.country
        }
        return Rest.post(this.url, data);
      }
    }

    return service;
  })
  .service('Town', function Town(Rest) {
    var service = {
      'url': "/towns/",
      'list': function (search, country, province) {
        var qStr = '?';
        if (search) qStr = qStr + 'search=' + search;
        if (country) qStr = qStr + '&country=' + country;
        if (province) qStr = qStr + '&province=' + province;
        return Rest.get(this.url + qStr);
      },
      'get': function (pk) {
        return Rest.get(this.url + pk + "/");
      },
      'save': function (pData) {
        var data = {
          'name': pData.name,
          'country': pData.country,
          'province': pData.province
        }
        return Rest.post(this.url, data);
      }
    }

    return service;
  })
  .service('Site', function Site(Rest) {
    var service = {
      'url': "/sites/",
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
          'lat': pData.lat,
          'long': pData.long,
          'town': pData.town,
        }
        return Rest.post(this.url, data);
      }
    }

    return service;
  })