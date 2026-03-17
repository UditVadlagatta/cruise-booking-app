import api from '../../api/index'

export const cruiseService =()=>{
    const getAllCruises = async ()=>{
        const response = await api.get('/cruises/getall');
        return response.data;
    }

    const updateCruise = async (id, imageFormData) => {
        const response = await api.put(`/cruises/update/${id}`,imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

         return response.data;
  };

  // const createCruise = async (cruiseData) => {
  //   // cruiseData should include all fields: name, description, price, capacity, status, route, image
  //   const formData = new FormData();

  //   formData.append("name", cruiseData.name);
  //   formData.append("description", cruiseData.description);
  //   formData.append("price", cruiseData.price);
  //   formData.append("capacity", cruiseData.capacity);
  //   formData.append("status", cruiseData.status || "ACTIVE");

  //   // Route should be sent as JSON string
  //   formData.append("route", JSON.stringify(cruiseData.route));

  //   // Image file
  //   if (cruiseData.image) {
  //     formData.append("image", cruiseData.image);
  //   }

  //   const response = await api.post('/cruises/create', formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data"
  //     }
  //   });

  //   return response.data;
  // };

  // const createCruise = async (cruiseData) => {
  //   const formData = new FormData();

  //   formData.append("name", cruiseData.name);
  //   formData.append("description", cruiseData.description);
  //   formData.append("price", cruiseData.price);
  //   formData.append("capacity", cruiseData.capacity);
  //   formData.append("status", cruiseData.status);

  //   // convert route object → string
  //   formData.append("route", JSON.stringify(cruiseData.route));

  //   if (cruiseData.image) {
  //     formData.append("image", cruiseData.image);
  //   }

  //   const response = await api.post("/cruises/create", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   return response.data;
  // };

//   const createCruise = async (cruiseData) => {
//   const formData = new FormData();

//   formData.append("name", cruiseData.name);
//   formData.append("description", cruiseData.description);
//   formData.append("price", cruiseData.price);
//   formData.append("capacity", cruiseData.capacity);
//   formData.append("status", cruiseData.status);

//   formData.append("route", JSON.stringify(cruiseData.route));

//   if (cruiseData.image) {
//     formData.append("image", cruiseData.image);
//   }

//   const response = await api.post("/cruises/create", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response.data;
// };

const createCruise = async (cruiseData) => {
    const formData = new FormData();

    formData.append("name", cruiseData.name);
    formData.append("description", cruiseData.description);
    formData.append("price", cruiseData.price);
    formData.append("capacity", cruiseData.capacity);
    formData.append("status", cruiseData.status);

    // route object → JSON string
    formData.append("route", JSON.stringify(cruiseData.route));

    if (cruiseData.image) {
      formData.append("image", cruiseData.image);
    }

    const response = await api.post("/cruises/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const updateCruiseImage = async (id, imageFormData) => {
    // call the same endpoint as updateCruise, sending only image
    return updateCruise(id, imageFormData);
  };

    return {
    getAllCruises,
    updateCruise,
    createCruise,
    updateCruiseImage
  };
}

// const cruiseService = {
//      getAllCruises : async ()=>{
//         const response = await api.get('/cruises/getall');
//         return response.data;
//     } 
    
// }

// export default cruiseService;