
import { Heading, VStack, useToast } from "native-base"
import { Header } from "../components/Header"
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {

  const [isLoading, setIsLoating] = useState(false)
  const [code, setCode] = useState("")
  const toast = useToast()
  const {navigate } = useNavigation()
  async function handleJoinPool() {
    if (!code.trim()) {
      return toast.show({
        title: 'Informe Cógido do bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
    try {
      setIsLoating(true)
     await api.post(`/pools/join`,{
      code
     })
     setCode("")
     toast.show({
      title: "Bolão emcontrado com sucesso.",
      placement: "top",
      bgColor: "green.500"
    })
     navigate("pools")

  
    } catch (error) {
      setCode("")
      setIsLoating(false)
      const mensagem = error.response?.data?.mensage;

      if (mensagem === '') {
       return toast.show({
          title: "Bolão não encontrado.",
          placement: "top",
          bgColor: "red.500"
        })
      }
      if (mensagem) {
      return toast.show({
        title: mensagem,
        placement: "top",
        bgColor: "red.500"
      })
    }

    return toast.show({
      title: "Nao foi possivel buscar Bolão",
      placement: "top",
      bgColor: "red.500"
    })
     
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">

        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"

      
        />

        <Button
          title="BUSCAR BOLÃO"
          onPress={handleJoinPool}
          isLoading={isLoading}
        />

      </VStack>
    </VStack>
  )
}