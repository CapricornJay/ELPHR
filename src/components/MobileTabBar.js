import React, { Component } from "react";
import { TabBar } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";

import { HomeOutlined, TeamOutlined, SearchOutlined, BarChartOutlined } from "@ant-design/icons";

import { withRouter, useHistory } from "react-router-dom";

const iconNonSelectStyle = { fontSize: "22px" };
const iconSelectedStyle = { fontSize: "22px", color: "#33A3F4" };

class TabBarMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, history } = this.props;
    console.log(location, history);

    return (
      <div style={{ position: "fixed", width: "100%", bottom: 0, zIndex: 900 }}>

      </div>
    );
  }
}

export default withRouter(TabBarMenu);
