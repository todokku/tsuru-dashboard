jest.dontMock('../jsx/components/list.jsx');

var React = require('react/addons'),
    List = require('../jsx/components/list.jsx'),
    nock = require('nock'),
    AppList = List.AppList,
    TestUtils = React.addons.TestUtils;

describe('Loading', function() {
  it('should has app-list as className', function () {
    var list = TestUtils.renderIntoDocument(
      <AppList url="http://localhost:80/apps/list.json" />
    );
    
    expect(list.getDOMNode("div").className).toEqual("app-list");
  });

  it ('should be composed by AppSearch, Loading and AppTable', function () {
    var list = TestUtils.renderIntoDocument(
      <AppList url="http://localhost:80/apps/list.json" />
    ).getDOMNode("div");

    expect(list.children.length).toEqual(3);

    var appSearch = list.children[0];
    expect(appSearch.className).toEqual("search");

    var loading = list.children[1];
    expect(loading.textContent).toEqual('');

    var appTable = list.children[2];
    expect(appTable.className).toEqual("table");
  });

  it('should load apps on render', function () {
    var scope = nock('http://localhost:80')
                    .get('/apps/list.json')
                    .reply(200, {
                      apps: [{name: "appname"}]
                    });

    var list = TestUtils.renderIntoDocument(
      React.createElement(List.AppList, {url: 'http://localhost:80/apps/list.json'})
    );
    expect({apps: [], cached: [], loading: true}).toEqual(list.state);
  });
});
