import { Table } from "../mongoConfig/mongoConnection";

/* Tables */
const readTables = async (query?: any) => {
  const tables = await Table.find(query);
  return tables;
};
const createTable = async (props) => {
  const { tableNo, tableName, teamId } = props;
  if (!tableNo && !tableName) {
    throw new Error("INSUFFICIENT_DATA_FOR_TABLE_CREATION");
  }
  const createdTable = new Table({
    tableNo: tableNo,
    tableName: tableName,
    teamId: teamId,
  });
  const successfullySavedTable = await createdTable.save();
  return successfullySavedTable;
};
const deleteTable = async (tableId) => {
  const deletedTables = await Table.deleteMany({ tableId: tableId });
  return deletedTables;
};

export { createTable, deleteTable, readTables };
