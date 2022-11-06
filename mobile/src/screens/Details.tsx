import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native"
import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native"
interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">("guesses")
  const [isLoading, setIsLoading] = useState(true)
  const [pool, setPool] = useState<PoolCardPros>({} as PoolCardPros)

  const route = useRoute()
  const { id } = route.params as RouteParams
  const toast = useToast();


  async function fetshPoolDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)
      setPool(response.data.pool)
      console.log(pool)

    } catch (error) {
      console.log(error)
      toast.show({
        title: 'nao foi possivel carregar os detalhes do bolao ',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pool.code
    });
  }
  useEffect(() => { fetshPoolDetails() }, [id])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={pool.title} showBackButton showShareButton onShare={handleCodeShare}/>
      {
        pool._count?.participants > 0 ?
          <VStack px={5} flex={1}>
            <PoolHeader data={pool} />
            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5} >
              <Option  
              title="Seus palpities" 
              isSelected={optionSelected === "guesses" } 
              onPress={ () => setOptionSelected("guesses") } />
              <Option  
              title="Ranking do grupo" 
              isSelected={optionSelected === "ranking" } 
              onPress={ () => setOptionSelected("ranking") }/>

            </HStack>
            <Guesses poolId={ pool.id }/>
            
          </VStack>
          
          : <EmptyMyPoolList code={pool.code} />
      }

    </VStack>
  )
}