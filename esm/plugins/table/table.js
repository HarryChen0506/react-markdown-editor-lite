import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';

var TableList = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TableList, _React$Component);

  function TableList(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.config = {
      padding: 3,
      width: 20,
      height: 20
    };
    var _props$maxRow = props.maxRow,
        maxRow = _props$maxRow === void 0 ? 5 : _props$maxRow,
        _props$maxCol = props.maxCol,
        maxCol = _props$maxCol === void 0 ? 6 : _props$maxCol;
    _this.state = {
      maxRow: maxRow,
      maxCol: maxCol,
      list: _this.formatTableModel(maxRow, maxCol)
    };
    return _this;
  }

  var _proto = TableList.prototype;

  _proto.formatTableModel = function formatTableModel(maxRow, maxCol) {
    if (maxRow === void 0) {
      maxRow = 0;
    }

    if (maxCol === void 0) {
      maxCol = 0;
    }

    var result = new Array(maxRow).fill(undefined);
    return result.map(function (_) {
      return new Array(maxCol).fill(0);
    });
  };

  _proto.calcWrapStyle = function calcWrapStyle() {
    var _this$state = this.state,
        maxRow = _this$state.maxRow,
        maxCol = _this$state.maxCol;
    var _this$config = this.config,
        width = _this$config.width,
        height = _this$config.height,
        padding = _this$config.padding;
    var wrapWidth = (width + padding) * maxCol - padding;
    var wrapHeight = (height + padding) * maxRow - padding;
    return {
      width: wrapWidth + "px",
      height: wrapHeight + "px"
    };
  };

  _proto.calcItemStyle = function calcItemStyle(row, col) {
    if (row === void 0) {
      row = 0;
    }

    if (col === void 0) {
      col = 0;
    }

    var _this$config2 = this.config,
        width = _this$config2.width,
        height = _this$config2.height,
        padding = _this$config2.padding;
    var top = (height + padding) * row;
    var left = (width + padding) * col;
    return {
      top: top + "px",
      left: left + "px"
    };
  };

  _proto.getList = function getList(i, j) {
    var list = this.state.list;
    return list.map(function (v, row) {
      return v.map(function (_, col) {
        return row <= i && col <= j ? 1 : 0;
      });
    });
  };

  _proto.handleHover = function handleHover(i, j) {
    this.setState({
      list: this.getList(i, j)
    });
  };

  _proto.handleSetTable = function handleSetTable(i, j) {
    var onSetTable = this.props.onSetTable;

    if (typeof onSetTable === 'function') {
      onSetTable({
        row: i + 1,
        col: j + 1
      });
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.visibility === false && prevProps.visibility !== this.props.visibility) {
      this.setState({
        list: this.getList(-1, -1)
      });
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React.createElement("ul", {
      className: "table-list wrap",
      style: this.calcWrapStyle()
    }, this.state.list.map(function (row, i) {
      return row.map(function (col, j) {
        return /*#__PURE__*/React.createElement("li", {
          className: "list-item " + (col === 1 ? 'active' : ''),
          key: i + "-" + j,
          style: _this2.calcItemStyle(i, j),
          onMouseOver: _this2.handleHover.bind(_this2, i, j),
          onClick: _this2.handleSetTable.bind(_this2, i, j)
        });
      });
    }));
  };

  return TableList;
}(React.Component);

export default TableList;