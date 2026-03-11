import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import axios from 'axios';

// const students = [
//   {mission_name:"FalconSat"},
//   {upcoming:false},
//   {launch_year:2006},
//   // { mission: "Ali", class: "Third Year", rollNo: 2 },
//   // { name: "Hamza", class: "Fourth Year", rollNo: 3 },
//   // { name: "Usama", class: "First Year", rollNo: 3 },
// ];


const typeDefs = `#graphql
  type LaunchFailureDetails {
    time: Int
    altitude: String
    reason: String
  }

  type Student {
    flight_number: Int
    mission_name: String
    upcoming: Boolean
    launch_success: Boolean
    launch_year: Int
    launch_date_local: String
    launch_failure_details: LaunchFailureDetails
    details: String
    static_fire_date_utc: String
    static_fire_date_unix: String
  }

  type Query {
    students: [Student]
    flight(flight_number: Int!): Student
  }
`;

const resolvers = {
  Query: {
    students: async () => (await axios.get("https://api.spacexdata.com/v3/launches")).data,
    flight: async (_, { flight_number }) => {
      const flights = (await axios.get("https://api.spacexdata.com/v3/launches")).data;
      return flights.find(flights => flights.flight_number === flight_number);
    },
  },
  };

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server);



