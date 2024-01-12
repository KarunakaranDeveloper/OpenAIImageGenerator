import React, { Component } from 'react';
import './ImageGenerator.css'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import Delete from "../assets/delete.svg"
import ConfirmationPopup from './ConfirmationPopup/ConfirmationPopup'
import { Constants } from './Constant';


class ImageGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prompt: '',
            generatedImages: [],
            error: null,
            loading: false,
            fullscreen: false,
            currentlySelectedImage: "",
            showSpinner: false,
            confirmationPopup:{
                confirmationMessage: Constants.DELETE_MESSAGE,
                id:"",
                showModal: false,
                handleCloseModal:"",
                handleConfirmModal:""
            }
        };
    }

    componentDidMount = () => {
        this.getAllGeneratedImages()
    }

    getAllGeneratedImages = async () => {
        const response = await axios.get(
            'http://127.0.0.1:8500/getall-generated-images'
        );
        console.log(response, "response")
        this.setState({ generatedImages: response?.data, loading: false })
    }

    handlePromptChange = (e) => {
        this.setState({ prompt: e.target.value });
    };

    handleGenerateImage = async () => {
        try {
            this.setState({ loading: true })
            const { prompt } = this.state;

            const response = await axios.post(
                'http://127.0.0.1:8500/generate-image',
                { text: prompt }
            );
            console.log(response, "response")
            this.setState({ prompt: "" })
            this.getAllGeneratedImages()
        } catch (error) {
            console.error('Error:', error.response?.data);
            this.setState({ generatedImages: [], error: 'An error occurred' });
        }
    };

    deleteImage = async () => {
        try {
            this.setState({ loading: true })

            const response = await axios.delete(
                `${'http://127.0.0.1:8500/delete-image/'}${this.state.confirmationPopup.id}`
            );
            console.log(response, "response")
            this.handleCloseModal()
            this.getAllGeneratedImages()
        } catch (error) {
            console.error('Error:', error.response?.data);
            this.setState({ generatedImages: [], error: 'An error occurred' });
        }
    }

    handleImageClick = (url) => {
        this.setState({ fullscreen: true, currentlySelectedImage: url });
        document.addEventListener('keydown', this.handleKeyPress);
    };

    handleDeleteImage = (id) =>{
        this.setState({
            confirmationPopup: {
                ...this.state.confirmationPopup,
                id: id,
                showModal: true,
                handleCloseModal:this.handleCloseModal,
                handleConfirmModal: this.deleteImage
            }
        })
    }

    handleFullscreenExit = () => {
        this.setState({ fullscreen: false });
        document.removeEventListener('keydown', this.handleKeyPress);
    };

    handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            this.handleFullscreenExit();
        }
    };

      handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        this.handleGenerateImage();
      };

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleCloseModal = () =>{
        this.setState({
            confirmationPopup: {
                ...this.state.confirmationPopup,
                id: "",
                showModal: false,
                handleCloseModal:"",
                handleConfirmModal:""
            }
        })
    }

    render() {
        const { prompt, generatedImages, error, loading, fullscreen, currentlySelectedImage } = this.state;
        console.log(loading, "loading")
        return (
            <div className='imageGenerator'>

                {error && error != null && <p className='error'>{error}</p>}

                {/* Full-screen Modal */}
                {fullscreen ?
                    <div className="fullscreen-modal" onClick={this.handleFullscreenExit}>
                        <img className="fullscreen-image" src={currentlySelectedImage} alt={currentlySelectedImage} />
                    </div>
                    :

                    <Container>
                        <h1 className="mt-4 mb-4 header">{Constants.HEADING}</h1>

                        <Row>
                            {/* Offset 4 columns */}
                            <Col md={{ span: 6, offset: 3 }}>
                                <Form onSubmit={this.handleFormSubmit}>
                                    <Row className="mb-4">
                                        <Col md={8} className='noPadding'>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your prompt..."
                                                value={prompt}
                                                onChange={this.handlePromptChange}
                                            />
                                        </Col>
                                        <Col md={4} className='noPadding'>
                                            <Button variant="primary" className='searchButton' onClick={this.handleGenerateImage} disabled={loading || prompt.length == 0}>
                                                {loading ? 'Searching...' : 'Search'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>

                                {loading && <p className='loader'>{Constants.LOADING}</p>}
                                {!loading && generatedImages.length === 0 && <p className='suggestions'>{Constants.NO_DATA}</p>}



                            </Col>
                        </Row>
                        <Row className='scrollableDiv'>
                            {generatedImages.length > 0 ?
                                generatedImages.map((image, index) => {
                                    return (
                                        <Col xs={6} lg={4} md={3} key={index}>
                                            <Card>
                                                <Card.Img variant="top" src={image.url} alt={image.alt} />
                                                <Card.Body>
                                                    {/* <Card.Title>{image.title}</Card.Title>
                                                    <Card.Text>{image.description}</Card.Text> */}
                                                    <Row>
                                                        <Col  md={12} className='center'>
                                                            <Button variant="primary" className='searchButton' onClick={() => this.handleImageClick(image.url)}>{Constants.VIEW}</Button>
                                                            <Button variant="primary" className='deleteButton' onClick={() => this.handleDeleteImage(image._id)}>{Constants.DELETE} <img src={Delete} className='deleteIcon'/></Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                }
                                )
                                : ""}

                        </Row>
                    </Container>

                }

                <ConfirmationPopup confirmationPopup={this.state.confirmationPopup}/>
            </div>
        );
    }
}

export default ImageGenerator;
export { ImageGenerator };
