import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { validateRut, formatRut } from "@/lib/rut";

export interface FormData {
  firstName?: string;
  email: string;
  password: string;
  rut: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    password: "",
    rut: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Auto-format RUT
    if (e.target.name === "rut") {
        value = formatRut(value);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRut(formData.rut)) {
        setErrorMessages(["El RUT ingresado no es válido."]);
        return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("firstName", formData.firstName || "");
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("rut", formData.rut);

      const response = await fetch("/api/sign-up", {
        method: "POST",
        body: form, // Use FormData
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (response.ok) {
          setErrorMessages([]);
          localStorage.setItem("user", JSON.stringify(responseData));
          window.location.href = "/";
        } else {
          const errors = responseData.errors || [
            { message: "Sign-up failed." },
          ];
          setErrorMessages(errors.map((error: any) => error.message));
        }
      } else {
        setErrorMessages(["Invalid response from the server."]);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessages(["An error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-11 sm:col-9 md:col-7 mx-auto">
            <div className="mb-14 text-center">
              <h2 className="max-md:h1 md:mb-2">Crear una cuenta</h2>
              <p className="md:text-lg">Regístrate para comenzar a comprar...</p>
            </div>

            <form onSubmit={handleSignUp}>
              <div>
                <label className="form-label">Nombre</label>
                <input
                  name="firstName"
                  className="form-input"
                  placeholder="Tu nombre completo"
                  type="text"
                  onChange={handleChange}
                  value={formData.firstName}
                  required
                />
              </div>

               <div className="mt-8">
                <label className="form-label">RUT</label>
                <input
                  name="rut"
                  className="form-input"
                  placeholder="12.345.678-9"
                  type="text"
                  onChange={handleChange}
                  value={formData.rut}
                  required
                />
              </div>

              <div>
                <label className="form-label mt-8">Correo Electrónico</label>
                <input
                  name="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>

              <div>
                <label className="form-label mt-8">Contraseña</label>
                <input
                  name="password"
                  className="form-input"
                  placeholder="********"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>

              {errorMessages.length > 0 &&
                errorMessages.map((error, index) => (
                  <p key={index} className="font-medium text-red-500 mt-2">
                    *{error}
                  </p>
                ))}

              <button
                type="submit"
                className="btn btn-primary md:text-lg md:font-medium w-full mt-10"
              >
                {loading ? (
                  <BiLoaderAlt className="animate-spin mx-auto" size={26} />
                ) : (
                  "Registrarse"
                )}
              </button>
            </form>

            <div className="flex gap-x-2 text-sm md:text-base mt-6">
              <p className="text-text-light dark:text-darkmode-text-light">
                Ya tienes cuenta?
              </p>
              <a
                className="underline font-medium text-text-dark dark:text-darkmode-text-dark"
                href="/login"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
