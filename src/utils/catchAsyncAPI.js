const catchAsyncAPI = (api, result, err) => {
  Promise.resolve(api)
    .then(value => {
      return result(value);
    })
    .catch(err1 => {
      return err(err1?.response);
    });
}

export default catchAsyncAPI;