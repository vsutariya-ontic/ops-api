export const getResponseJson = (data?: any, success = true) => {
  if (!data) {
    return { success: success };
  } else
    return {
      data: data,
      success: success,
    };
};
