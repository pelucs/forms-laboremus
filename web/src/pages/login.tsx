import { z } from "zod";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import logo100Anos from '../../public/logo-100-anos.png';
import logo100AnosBranca from '../../public/logo-100-anos-branca.png';
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4),
});

type FormTypes = z.infer<typeof formSchema>;

export function Login() {

  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormTypes>({
    resolver: zodResolver(formSchema)
  });

  const login = async (data: FormTypes) => {
    const { email, password } = data;

    await api.post("/login", {
      email,
      password,
    })
    .then(res => {
      const expireTokenInSeconds = 60 * 60 * 24 * 30;
      document.cookie = `token=${res.data.token}; Path=/; max-age=${expireTokenInSeconds};` 

      window.location.pathname = "/formularios"
    })
    .catch(err => {
      toast({
        title: err.message
      })
    })
  }

  return(
    <div className="h-screen flex flex-col gap-5 md:gap-10 items-center justify-center">
      <div>
        <img src={logo100AnosBranca} alt="" className="hidden dark:block w-[70px]"/>
        <img src={logo100Anos} alt="" className="block dark:hidden w-[70px]"/>
      </div>

      <form onSubmit={handleSubmit(login)} className="w-[400px] p-10 flex flex-col gap-5 rounded">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold">Efetue Login</h1>
          <span className="text-sm text-muted-foreground">Esta área é exclusiva para funcionários internos.</span>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="user" className="text-xs uppercase font-semibold text-muted-foreground">Email corporativo</label>
            
            <Input 
              type="email"
              className="input"
              {...register("email")}
              placeholder="Insira seu email corporativo"
            />

            {errors.email && (
              <span className="text-xs text-red-500">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs uppercase font-semibold text-muted-foreground">Senha</label>
            
            <div className="relative">
              <Input 
                id="password"
                type={visiblePassword ? "text" : "password"}
                {...register("password")}
                placeholder="Insira sua senha"
                className="pr-10"
              />

              <Button 
                type="button"
                size={"icon"} 
                variant={"ghost"} 
                className="size-6 absolute right-2 top-[6px]"
                onClick={() => setVisiblePassword(!visiblePassword)}
              >
                { visiblePassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
              </Button>
            </div>

            {errors.password && (
              <span className="text-xs text-red-500">{errors.password.message}</span>
            )}
          </div>
        </div>

        <p className="text-sm text-center text-zinc-500 leading-none">
          Esqueceu seu acesso? entre em contato <br/> com o departamento de TI.
        </p>

        <Button type="submit">
          Efetuar Login
        </Button>
      </form>
    </div>
  );
}