const PROTO_PATH = "../customers.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var customersProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const customers = [
  {
    id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
    name: "sachchin ram",
    age: 23,
    address: "Colombo",
  },
  {
    id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
    name: "John David",
    age: 45,
    address: "New York",
  },
  {
    id: "a68b823c-7ca6-44bc-b721-fb4d5312caff",
    name: "Aravinth Rahman",
    age: 46,
    address: "Chennai",
  },
  {
    id: "76415c7c-f82d-4e44-88ca-ae2a1aaa92n6",
    name: "Ranvika Kumar",
    age: 40,
    address: "Kurunakala",
  },
];

server.addService(customersProto.CustomerService.service, {
  getAll: (_, callback) => {
    callback(null, { customers });
  },

  get: (call, callback) => {
    let customer = customers.find((n) => n.id == call.request.id);

    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  addCustomer: (call, callback) => {
    let customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },

  update: (call, callback) => {
    let existingCustomer = customers.find((n) => n.id == call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
      (n) => n.id == call.request.id
    );

    if (existingCustomerIndex != -1) {
      customers.splice(existingCustomerIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bindAsync(
  "localhost:30043",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running at http://127.0.0.1:30043");
    server.start();
  }
);
