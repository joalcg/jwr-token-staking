# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.


## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

#  Asignación final Modulo 3
## ETH-KIPU Latinoamerica
## ETH Developer Pack 

## Estudiantes

1. Randall Brenes
2. Wilmer Ramírez
3. Jose Cerdas

# 1. Detalles de asignación

## 1.1. Desarrollo de un Contrato Inteligente en Equipos de 3 Personas

## 1.2. Objetivo: Desarrollar un contrato inteligente basado en uno de los siguientes casos de uso:

1. Marketplace de NFTs
2. Staking de Token ERC-20

Cada equipo debe elegir un contrato y discutir cómo desarrollarlo. El objetivo es presentar una solución funcional que cubra los aspectos clave del contrato, utilizar patrones de diseño en Solidity cuando sea necesario, y demostrar el despliegue en una red de prueba.

## 1.3. Requerimientos de Entrega:

### 1.3.1. Contrato Inteligente Desplegado:

1. Desplieguen el contrato en una red de prueba (por ejemplo, Sepolia).
2. No es necesario verificar el contrato.
3. Se debe proporcionar el enlace de Etherscan al contrato desplegado.

### 1.3.2. Repositorio de GitHub:

1. Suban el código del contrato a un repositorio de GitHub.
2. El repositorio debe incluir un README con la siguiente información:

    1. Descripción del contrato: Explicación del contrato desarrollado, incluyendo la funcionalidad principal.
    2. Razonamiento detrás del diseño: Breve explicación de las decisiones técnicas y de diseño tomadas durante el desarrollo, haciendo énfasis en el uso de patrones de diseño en Solidity donde sea necesario.
    3. Integrantes del equipo: Incluyan los perfiles de GitHub de los miembros del equipo.

# 2. Resultados de implementación

## 2.1. Sobre implementación

1. Se escogió implementar un contrato de **`Staking`** de **`ERC20`**, por las recomendaciones y sugerencias se usó librería **`IERC20`**, _token inmutable_
2. Se requirió implementar un _token_ personalizado para poder probar el contrato de _Staking_ en modo virtualizado o simulado dado que se pide verificación de uso de un _token_ con conformidad de **`ERC20`** o **`IERC20`**.
3. Se probaron con éxito las implementaciones virtualizadas o simuladas del contrato de _Staking_ y el contrato del _Token_ en Remix VM (Cancun).
4. Se recomienda inicializar el contrato con un rewardsEarned=1 para asegurar que los rewards incremental de una manera más realista. 

## 2.2. Explicación de contrato

1. Contrato de _staking_ de _tokens_ **`IERC20`**. Este contrato premia a usuarios que ceden una cantidad de _tokens_ al contrato, el rendimiento lo calcula como cantidad de _tokens_ cedidos por segundos transcurridos por **`rewardRate/1000`** (esto para hacer el contrato más realista). 
2. Creación de contrato solicita uso de _token_ conforme con **`IERC20`** y tasa de recompensa **`rewardRate`**, que se considera en la práctica como **`rewardRate/1000`** _token_ por segundo por _token_ cedido.
3. Para mayor control el contrato lleva contabilidad separada de monto cedido, **`amount`**, y recompensa de _staking_, **`rewardEarned`**.
4. Se tiene operación **`stake()`** para transferir _tokens_ de usuario al contrato de _staking_.
5. Se tiene función **`withdraw()`** para retirar _tokens_ cedidos de vuelta al dueño, este solicita un monto a retirar como entrada.
5. Se tiene función **`claimRewards()`** para retirar todos los _tokens_ recompensados (el rendimiento o premio actual).
6. Se tiene función privada **`_updateRewards()`** para actualizar recompensa de rendimiento, actualiza los _tokens_ de **`rewardEarned`** y el tiempo de conteo **`timestamp`**. Esta función está implementada dentro de las operaciones que implican transferencia. Antes de hacer cualquier transferencia dentro de `stake()`,`withdraw()` y `claimRewards()` primero se calcula recompensa y luego se ejecuta transferencia.
7. Se tiene operación **`getStake()`** para obtener posición actual de usuario en el contrato (devuelve el monto actual cedido y las recompensas calculadas las última vez que se hizo transferencia).
8. La mayoría de operaciones tienen registro de evento para facilitar trazabilidad.
9. También existe el registro **`stakes`** donde se puede visualizar cuantos _tokens_ están cedidos (**`stake`**), cuántos tokens lleva de recompensa (**`rewardsEarned`**) y cuántos segundos han transcurrido desde última actualización de recompensa (**`timestamp`**). 

## 2.3. Decisiones tomadas en diseño de contrato de _Staking_

### 2.3.1. Librerias

1. Uso  de librería **`IERC20`** de _Open-Zepellin_, para heredar requisitos, variables, modificadores y funciones del contrato estándar  **`IERC20`**, _tokens_ inmutables como criptomonedas, y lograr conformidad con estándar. 
2. Uso  de librería **`Ownable`** de _Open-Zepellin_, para heredar requisitos, variables, modificadores y funciones del contrato estándar  **`Ownable`**, contratos que permiten propiedad por otros,  y lograr conformidad con estándar. 
3. Uso  de librería **`ReentrancyGuard`** de _Open-Zepellin_, para heredar requisitos, variables, modificadores y funciones del contrato estándar  **`ReentrancyGuard`**, mecanismos de protección contra re-entrada de registros, y lograr conformidad con estándar.
4. Uso  de librería **`Pausable`** de _Open-Zepellin_, para heredar requisitos, variables, modificadores y funciones del contrato estándar  **`Pausable`**, mecanismos de protección de pausa y rehabilitación del contrato, y lograr conformidad con estándar.
5. Uso infructuoso de librería **`safeERC20`** dado que está limitado a versión de compilador 0.8.0, se decidió no usar para aplicar compilador más reciente. 

### 2.3.2. Decisiones en código

1. Uso de modificador **`nonReentrant`** de librería  **`ReentrancyGuard`** para proteger los funciones de transferencia de _tokens_ de ataques de reentradas.
2. Implementación de funciones **`pause()`** y **`unpause()`** como solicita la librería  **`Pausable`**, permitidas únicamente al dueño del contrato mediante modificador **`onlyOwner`**, el dueño pausa y despausa el contrato a su discreción como mecanismo de protección.
3. Uso de modificador **`whenNotPaused`** de librería  **`Pausable`** para deshabilitar funciones críticas de transferencias del contrato cuando se activa **`pause()`**, funciona como mecanismo de emergencia de protección contra actividades sospechosas. En este caso solo deshabilita la ejecución de funciones **`stake()`**, **`withdraw()`** y **`claimRewards()`**.
4. Implementación de función **`_updateRewards()`** como **`private`** para evitar llamadas por cualquier agente externo y limitarlas a que se hagan dentro del contrato.
5. Implementación de un estado **`bool`** llamado **`success`** y un **`require`** de ese booleano para hacer las transferencias más seguras. Si no se logra éxito en la transferencia no se actualizan los registros del contrato de _Staking_.
6. Intento sin éxito de utilizar funciones **`safeTransfer()`** y **`safeTransferFrom()`** de librería **`safeERC20`** por antigüedad y no compatibilidad con el compilador.
7. Implementación en **`_updateRewards()`** del objeto **`block.number`** en lugar de **`block.timestamp`** para aumentar la seguridad en el cálculo de rendimiento o recompensa por realizar _staking_. 
8. Modificación de **`_updateRewards()`** a usar la fracción **`rewardRate/1000`** (la división se hace en la función) en lugar de sólo **`rewardRate`** para hacer realista el cálculo de recompensa. Los funciones usuales de un mínimo **`rewardRate`** de 1, que se interpreta como 1 _token_ por segundo por cada _token_ cedido, hacen que  el saldo de rendimiento rápidamente alcance y supere por varios órdenes de magnitud el monto de _tokens_ cedido al contrato de _Staking_.
9. Implementaciones separadas de montos para mayor claridad, transparencia y control; el monto de _tokens_ cedido se registra como **`amount`** y los rendimientos ganados se registran como **`rewardEarned`**. 
10. Implementaciones separadas de retiros de montos para mayor claridad, transparencia y control; el monto cedido se retira con función **`withdraw()`** (exige especificar monto específico con chequeos de tener balance) y los rendimientos ganados se retiran con **`claimRewards()`** (retira toda la recompensa sin preguntar por monto).

## 2.4 Opciones de mejora futuras

1. Se puede modificar la función **`claimRewards()`** para permitir retirar un monto parcial y no toda la recompensa.
2. Se puede implementar pausa automática del contrato mediante la verificación de una o varias condiciones en el contrato, por ejemplo cantidad de retiros sucesivos en una ventana dada de tiempo, contador de ciertos tipos de error, contador de algún registro de **`nonReentrant`**, balance mínimo de **`stakes`**, otras condiciones.