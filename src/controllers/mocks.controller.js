import MockingService from "../services/mocking.js";

const getMockingPets = async (req, res) => {
  const pets = await MockingService.generateMockingPets(100);
  res.send({ status: "success", payload: pets });
}

const getMockingUsers = async (req, res) => {
  const users = await MockingService.generateMockingUsers(50);
  res.send({ status: "success", payload: users });
}

const generateData = async (req, res) => {
  try {
    const { users, pets } = req.body;

    if (!users || !pets) {
      return res.status(400).json({ status: "error", message: "Parámetros 'users' y 'pets' son requeridos" });
    }

    const result = await MockingService.generateAndInsertData(Number(users), Number(pets));

    res.status(201).json({
      status: "success",
      message: "Datos generados e insertados correctamente",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error generando datos", error: error.message });
  }
};

export default {
  getMockingPets,
  getMockingUsers,
  generateData
}
