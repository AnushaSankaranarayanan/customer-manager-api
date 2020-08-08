const customerController = require('./customer.controller')
const Customer = require('../models/customer.model')
jest.mock('../models/customer.model')

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
};

const mockRequest = () => {
  const req = {}
  req.params = jest.fn().mockReturnValue(req)
  req.query = jest.fn().mockReturnValue(req)
  return req
};

const mockData = {
  code: '200',
  status: 'OK',
  message: 'Success',
  payload: null
};

describe('Customer controller tests', () => {

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  test('Create Customer - Success', async () => {
    const spy = jest.spyOn(Customer.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve({}))
    const validReq = mockRequest()
    validReq.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse()
    await customerController.create(validReq, res)
    expect(spy).toHaveBeenCalled()
    expect(res.status).toBeCalledWith(200)
  })

  test('Get Customer by Invalid Id - Failure', async () => {
    const error = new Error();
    error.kind = 'ObjectId'
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findById.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.findOne(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    //expect(res.status).toBeCalledWith(404);
  });

  test('Get Customer by Id - Failure', async () => {
    const error = new Error();
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findById.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.findOne(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    //expect(res.status).toBeCalledWith(500);
  });

  test('Get Customer who was deleted before - Failure', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve(null));
    Customer.findById.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.findOne(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    expect(res.status).toBeCalledWith(404);
  });

  test('Get Customer by Id - Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.findById.mockImplementation(getSpy);
    const res = mockResponse();
    const req = mockRequest();
    req.params = { customerId: '123' };
    await customerController.findOne(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(getSpy).toBeCalledWith(req.params.customerId);
  });

  test('Get All Customers Server Error - Failure', async () => {
    const error = new Error();
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.paginate.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    await customerController.findAll(req, res);
    expect(getSpy).toBeCalled();
    //expect(res.status).toBeCalledWith(400);
  });

  test('Get All Customers with Query Parameters(offset ,limit, sortkey and sortdir)- Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.paginate.mockImplementation(getSpy);
    const res = mockResponse();
    const req = mockRequest();
    req.query = { offset: 10, limit: 10, sortkey: 'name', sortdir: 'asc' };
    await customerController.findAll(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(getSpy).toBeCalled()
  });

  test('Get All Customers with more than the allowed limit - Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.paginate.mockImplementation(getSpy);
    const res = mockResponse();
    const req = mockRequest();
    req.query = { offset: 10, limit: 10000, sortkey: 'name', sortdir: 'asc' };
    await customerController.findAll(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(getSpy).toBeCalled()
  });


  test('Get All Customers with default parameters- Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.paginate.mockImplementation(getSpy);
    const res = mockResponse();
    const req = mockRequest();
    await customerController.findAll(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(getSpy).toBeCalled()
  });

  test('Update Customer by Invalid Id - Failure', async () => {
    const error = new Error();
    error.kind = 'ObjectId'
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findOneAndUpdate.mockImplementation(getSpy);
    const req = mockRequest();
    req.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.update(req, res);
    expect(getSpy).toHaveBeenCalled();
    //expect(res.status).toBeCalledWith(400);
  });

  test('Update Customer invalid email - Failure', async () => {
    const error = new Error();
    error.name = 'ValidationError'
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findOneAndUpdate.mockImplementation(getSpy);
    const req = mockRequest();
    req.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'testexample.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.update(req, res);
    expect(getSpy).toHaveBeenCalled();
    //expect(res.status).toBeCalledWith(400);
  });

  test('Update Customer server error - Failure', async () => {
    const error = new Error();
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findOneAndUpdate.mockImplementation(getSpy);
    const req = mockRequest();
    req.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.update(req, res);
    expect(getSpy).toHaveBeenCalled();
    //expect(res.status).toBeCalledWith(400);
  });

  test('Update Customer who was deleted before - Failure', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve(null));
    Customer.findOneAndUpdate.mockImplementation(getSpy);
    const req = mockRequest();
    req.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.update(req, res);
    expect(getSpy).toHaveBeenCalled();
    expect(res.status).toBeCalledWith(404);
  });

  test('Update Customer - Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.findOneAndUpdate.mockImplementation(getSpy);
    const req = mockRequest();
    req.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.update(req, res);
    expect(getSpy).toHaveBeenCalled();
    expect(res.status).toBeCalledWith(200);
  });

  test('Delete Customer by Invalid Id - Failure', async () => {
    const error = new Error();
    error.kind = 'ObjectId'
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findByIdAndRemove.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.delete(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    //expect(res.status).toBeCalledWith(400);
  });

  test('Delete Customer Server Error - Failure', async () => {
    const error = new Error();
    const getSpy = jest.fn().mockReturnValue(Promise.reject(error));
    Customer.findByIdAndRemove.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.delete(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    //expect(res.status).toBeCalledWith(400);
  });

  test('Delete Customer who was deleted before - Failure', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve(null));
    Customer.findByIdAndRemove.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.delete(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    expect(res.status).toBeCalledWith(404);
  });

  test('Delete Customer - Successful', async () => {
    const getSpy = jest.fn().mockReturnValue(Promise.resolve({}));
    Customer.findByIdAndRemove.mockImplementation(getSpy);
    const req = mockRequest();
    const res = mockResponse();
    req.params = { customerId: '123' };
    await customerController.delete(req, res);
    expect(getSpy).toBeCalledWith(req.params.customerId);
    expect(res.status).toBeCalledWith(200);
  });

})

