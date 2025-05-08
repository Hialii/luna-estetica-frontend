import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash } from 'react-icons/fi';
import { api } from './services/api';

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  service: string;
  scheduledDateTime?: string;
  created_at?: string;
  updated_at?: string;
}
function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const serviceRef = useRef<HTMLSelectElement | null>(null);
  const dateTimeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get('/customers');
    console.log(response.data);
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    let dateTimeUTC;
    if (dateTimeRef.current?.value) {
      dateTimeUTC = new Date(dateTimeRef.current.value).toISOString();
    } else {
      throw new Error('Valor de data/hora não definido');
    }

    const response = await api.post('/customer', {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      service: serviceRef.current?.value,
      scheduledDateTime: dateTimeUTC,
    });

    setCustomers((allCustomers) => [...allCustomers, response.data]);
  }

  async function handleDelete(id: string) {
    await api.delete('/customer', {
      params: {
        id: id,
      },
    });
    const allCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(allCustomers);
  }

  return (
    <>
      <div className='w-full min-h-screen bg-pink-400 flex justify-center px-4'>
        <main className='my-10 w-full md:max-w-2xl'>
          <h1 className='text-4xl font-medium text-white'>
            Agendameto Luna Estética
          </h1>

          <form className='flex-flex-col my-6 mb-16' onSubmit={handleSubmit}>
            <label className='font-medium text-white'>Nome</label>
            <input
              type='text'
              placeholder='Digite o nome'
              className='w-full mb-5 p-2 rounded'
              ref={nameRef}
            />
            <label className='font-medium text-white'>Email</label>
            <input
              type='email'
              placeholder='Digite o email'
              className='w-full mb-5 p-2 rounded'
              ref={emailRef}
            />

            <label className='font-medium text-white'>Serviço</label>
            <select className='w-full mb-5 p-2 rounded' ref={serviceRef}>
              <option value='Brown lamination'>Brown lamination</option>
              <option value='Lash lifing'>Lash lifing</option>
              <option value='Nanoblanding fio-a-fio'>
                Nanoblanding fio-a-fio
              </option>
              <option value='Preenchimento labial'>Preenchimento labial</option>
            </select>

            <label className='font-medium text-white'>Data e Hora</label>
            <input
              type='datetime-local'
              className='w-full mb-5 p-2 rounded'
              ref={dateTimeRef}
            />

            <input
              type='submit'
              value='Agendar'
              className='font-medium cursor-pointer w-full p-2 bg-green-500 rounded'
            />
          </form>

          <section className='flex flex-col  '>
            <input
              type='search'
              placeholder='Procurar cliente'
              className='w-full mb-5 p-2 rounded'
            />
            {customers.map((customer) => (
              <article
                key={customer.id}
                className='w-full my-2 bg-white rounded p-2 relative hover:scale-105 duration-200'
              >
                <p>
                  <span className='font-medium'>Nome: </span>
                  {customer.name}
                </p>
                <p>
                  <span className='font-medium'>Email: </span>
                  {customer.email}
                </p>
                <p>
                  <span className='font-medium'>Serviço: </span>
                  {customer.service}
                </p>
                <p>
                  <span className='font-medium'>Data/Hora: </span>
                  {customer.scheduledDateTime}
                </p>

                <button className='bg-red-500 w-7 h-7 flex items-center justify-center rounded absolute right-0 -top-0 hover:scale-110 duration-200'>
                  <FiTrash
                    size={18}
                    color='#FFF'
                    onClick={() => handleDelete(customer.id)}
                  />
                </button>
              </article>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
