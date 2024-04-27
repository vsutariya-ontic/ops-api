import { createTable, readTables } from "../data/table/tableOperations";
import { getResponseJson } from "../utils/jsonUtils";

/* table api call handlers */
const handleGetTable = async (request, response) => {
  try {
    const tableId = request.query?.["tableId"];
    if (tableId) {
      const table = (await readTables(request.query))[0];
      response.json(getResponseJson(table));
    } else {
      const tables = await readTables();
      response.json(getResponseJson(tables));
    }
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handlePostTable = async (request, response) => {
  try {
    const successfullySavedTable = await createTable(request.body);
    response.json(getResponseJson(successfullySavedTable));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handleDeleteTable = async (request, response) => {};

export { handleDeleteTable, handleGetTable, handlePostTable };
