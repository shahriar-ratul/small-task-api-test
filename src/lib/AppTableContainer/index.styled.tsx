import { rgba } from "polished";
import styled from "styled-components";
import { Table } from "antd";

export const StyledQueueAnim = styled(Table)`
  min-height: 0.01%;
  overflow-x: auto;

  thead > tr > th,
  tbody > tr > th,
  tfoot > tr > th,
  thead > tr > td,
  tbody > tr > td,
  tfoot > tr > td {
    white-space: nowrap;
  }

  @media screen and (max-width: 767px) {
    &.ant-table {
      width: 100%;
      overflow-y: hidden;
      border: 1px solid #000000;
    }
  }

  &.hoverColor {
    & tbody > tr {
      transition: all 0.2s ease;
      transform: scale(1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 10px 0 ${() => rgba("black", 0.2)};
        background-color: ${() => rgba("#0A8FDC", 0.1)};
      }
    }

    & .ant-table-tbody > tr.ant-table-row:hover > td {
      background-color: transparent;
    }
  }
`;
