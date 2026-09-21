import React,{Component,PropsWithChildren} from "react";
type Props=PropsWithChildren;
type State={error:Error|null};
export class ErrorBoundary extends Component<Props,State>{state:State={error:null};static getDerivedStateFromError(error:Error){return {error}}render(){if(this.state.error)return <>{this.state.error.message}</>;return this.props.children}}