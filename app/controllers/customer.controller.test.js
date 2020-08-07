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

  test('Create Customer - Invalid request body - Failure', async () => {
    jest.spyOn(Customer.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve({}))
    const req = mockRequest()
    const res = mockResponse()
    await customerController.create(req, res)
    expect(res.status).toBeCalledWith(400)
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
    expect(res.status).toBeCalledWith(201)
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

})

