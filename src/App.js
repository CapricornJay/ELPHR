import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import PatientPage from "./routes/patients";
import SearchPage from "./routes/search";
import StatisticsPage from "./routes/statistics";
import NotFoundPage from "./routes/NotFoundPage";
import HomePage from "./routes/home";
import SideMenu from "./components/SideMenu";
import MobileTabBar from "./components/MobileTabBar";

import { CaretDownOutlined, UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";

import { Layout, Avatar, Popconfirm, Radio, Tooltip, Modal, message } from "antd";
import GlobalContextConsumer from "./components/GlobalContext";

import { GlobalContext, GlobalContextProvider } from "./components/GlobalContext";

const { Header, Sider, Footer } = Layout;

class DesktopMenu extends React.Component {
  state = {
    collapsed: false
  };

  updateCollapsed = collapsed => {
    this.setState({
      collapsed: collapsed
    });
  };

  componentDidMount() {
    message.config({
      top: 80
    });
  }

  render() {
    return (
      <Sider
        collapsible
        onCollapse={this.updateCollapsed}
        breakpoint="lg"
        width="230"
        style={{
          boxShadow: "7px 0px 20px -10px rgba(0,0,0,0.35) !important",
          overflow: "auto !important",
          height: "100vh !important",
          position: "sticky !important",
          top: 0,
          left: 0
        }}
      >
        <SideMenu></SideMenu>
        <div style={{ flexGrow: 1 }}></div>
      </Sider>
    );
  }
}

const routes = [
  {
    path: "/",
    exact: true,
    title: () => "ELPHR",
    main: () => <HomePage />
  },
  {
    path: "/patients",
    title: () => "ELPHR",
    main: () => <PatientPage />
  },
  {
    path: "/search",
    title: () => "ELPHR",
    main: () => <SearchPage />
  },
  {
    path: "/statistics",
    title: () => "Dashboard",
    main: () => <StatisticsPage />
  },
  {
    title: () => "404 Not Found",
    main: () => <NotFoundPage />
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = GlobalContext;

  handleViewChange = value => {
    const { setViewInCard } = this.context;
    console.log(setViewInCard, value, this.context);
    setViewInCard(value == "card");
  };

  confirmLogout = () => {
    Modal.success({
      title: "You have successfully logged out",
      content: "You will be logged out of a real system, but not in this demo prototype."
    });
  };

  render() {
    console.log(this.props);
    console.log(window.location.hostname);

    const basename =
      window.location.hostname == ""
        ? ""
        : "";

    return (
      <Router basename={basename}>
        <Layout style={{ minHeight: 100 + "vh" }}>
          <GlobalContextConsumer>
            {value => {
              if (!value.isMobile) {
                return <DesktopMenu></DesktopMenu>;
              } else {
                return <MobileTabBar></MobileTabBar>;
              }
            }}
          </GlobalContextConsumer>

          <Layout className="site-layout">
            <Header className="site-layout-header">
              <h2 style={{ paddingLeft: 20 + "px" }}>
                <Switch>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      children={<route.title />}
                    />
                  ))}
                </Switch>
              </h2>

              <div style={{ flexGrow: 1, textAlign: "right", paddingRight: "20px" }}>
                <GlobalContextProvider>
                  <Radio.Group
                    defaultValue="table"
                    onChange={e => {
                      console.log(e);
                      this.handleViewChange(e.target.value);
                    }}
                    size="small"
                  >
                    <Radio.Button value="table">
                      <Tooltip placement="bottom" title="View patients in a table">
                        <UnorderedListOutlined />
                      </Tooltip>
                    </Radio.Button>
                    <Radio.Button value="card">
                      <Tooltip placement="bottom" title="View patients in cards">
                        <AppstoreOutlined />
                      </Tooltip>
                    </Radio.Button>
                  </Radio.Group>
                </GlobalContextProvider>
                <Popconfirm
                  placement="bottomRight"
                  title="Would you like to logout of the system?"
                  onConfirm={this.confirmLogout}
                  okText="Logout"
                  cancelText="Cancel"
                >
                  <Avatar
                    style={{ marginLeft: "20px", marginRight: !this.context.isMobile && "5px" }}
                  />
                  {!this.context.isMobile && <CaretDownOutlined />}
                </Popconfirm>
              </div>
            </Header>

            <RouterContent></RouterContent>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const RouterContent = () => {
  let location = useLocation();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Switch location={location}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={
                <div className="container">
                  <div className="page">
                    <route.main />
                  </div>
                </div>
              }
            />
          ))}
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};


export default App;
