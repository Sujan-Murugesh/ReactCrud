import { useEffect, useState } from "react";
import PersonForm from "./PersonForm"
import PersonList from "./PersonList"
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import axios from "axios";

function Person() {
  //to load data from API
  const BaseUrl = import.meta.env.VITE_BASE_API_URL + "/people";
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [editData, setEditData] = useState(null);

  const defaultFormValues = {
    id: 0,
    firstName: "",
    lastName: "",
  };

  const methods = useForm({
    defaultValues: defaultFormValues,
  });
  const { reset } = methods;

  useEffect(() => {
    try {
      setLoading(true);
      const loadPeople = async () => {
        var peopleData = (await axios.get(`${BaseUrl}`)).data;
        setPeople(peopleData);
      }
      loadPeople();
    }
    catch (error) {
      console.error('Error loading people:', error);
      toast.error(`Error loading people: ${error?.message ?? ''}`);
    }
    finally {
      setLoading(false);
      // Any cleanup or final actions can be performed here if needed
    }
  }, [BaseUrl]);

  // reset form when editData changes
  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);


  // const [people, setPeople] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/people`);
  //       const data = await response.json();
  //       setPeople(data);
  //     } catch (error) {
  //       console.error('Error fetching people data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);
  // Dummy data for demonstration
  // const [people, setPeople] = useState([
  //   { id: 1, firstName: 'John', lastName: 'Doe' },
  //   { id: 2, firstName: 'Jane', lastName: 'Smith' },
  //   { id: 3, firstName: 'Jim', lastName: 'Brown' },
  //   { id: 4, firstName: 'Jake', lastName: 'White' }
  // ]);

  const handleFormSubmit = async (person) => {
    try {
      setLoading(true);
      if (person.id <= 0) {
        const createdPerson = (await axios.post(`${BaseUrl}`, person)).data;
        setPeople((previousPerson) => [...previousPerson, createdPerson]);
        console.log('Create person:', createdPerson);
      } else {
        const updatedPerson = (await axios.put(`${BaseUrl}/${person.id}`, person)).data;

        // merge with existing in case API response is partial
        setPeople((previousPerson) =>
          previousPerson.map(p =>
            p.id === person.id ? { ...p, ...person, ...updatedPerson } : p
          )
        );
        console.log('Update person:', updatedPerson);
      }
      methods.reset(defaultFormValues);
      toast.success('Person data saved successfully');
    } catch (error) {
      toast.error(`Error occurred while saving person data: ${error?.message ?? ''}`);
    }
    finally {
      setLoading(false);
    }
  }

  const handleFormReset = () => {
    methods.reset(defaultFormValues);
  }

  const handlePersonEdit = (person) => {
    setEditData(person);
  }

  const handlePersonDelete = async (person) => {
    if (!window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BaseUrl}/${person.id}`);
      setPeople((previousPerson) => previousPerson.filter(p => p.id !== person.id));
      if (editData && editData.id === person.id) {
        methods.reset(defaultFormValues);
      }
      console.log('Delete person:', person);
      toast.success('Person data deleted successfully');
    } catch (error) {
      toast.error(`Error occurred while deleting person data: ${error?.message ?? ''}`);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Person Management
          </h1>
          {loading && <p className="mt-2 text-gray-500">Loading...</p>}
        </div>

        <PersonForm methods={methods} onFormReset={handleFormReset} onFormSubmit={handleFormSubmit} />
        <PersonList
          peopleList={people}
          onPersonEdit={handlePersonEdit}
          onPersonDelete={handlePersonDelete}
        />
      </div>
    </div>
  )
}

export default Person